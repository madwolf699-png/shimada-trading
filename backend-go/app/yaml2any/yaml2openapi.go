package main

import (
	"fmt"
	"os"
	"regexp"
	"strings"

	"gopkg.in/yaml.v3"
)

// ===== DB YAML構造 =====

type Database struct {
	Name    string  `yaml:"name"`
	Version float64 `yaml:"version"`
}

type Column struct {
	Name          string `yaml:"name"`
	Type          string `yaml:"type"`
	PK            bool   `yaml:"pk"`
	NotNull       bool   `yaml:"not_null"`
	AutoIncrement bool   `yaml:"auto_increment"`
	Comment       string `yaml:"comment"`
}

type Table struct {
	Name    string   `yaml:"name"`
	Comment string   `yaml:"comment"`
	Columns []Column `yaml:"columns"`
}

type DBSpec struct {
	Database Database `yaml:"database"`
	Tables   []Table  `yaml:"tables"`
}

// ===== OpenAPI構造 =====

type OpenAPI struct {
	OpenAPI    string                 `yaml:"openapi"`
	Info       Info                   `yaml:"info"`
	Paths      map[string]interface{} `yaml:"paths"`
	Components Components             `yaml:"components"`
}

type Info struct {
	Title   string `yaml:"title"`
	Version string `yaml:"version"`
}

type Components struct {
	Schemas map[string]Schema `yaml:"schemas"`
}

type Schema struct {
	Type        string              `yaml:"type"`
	Description string              `yaml:"description,omitempty"`
	Properties  map[string]Property `yaml:"properties"`
	Required    []string            `yaml:"required,omitempty"`
	XTableName  string              `yaml:"x-table-name,omitempty"`
}

type Property struct {
	Type           string `yaml:"type"`
	Format         string `yaml:"format,omitempty"`
	MaxLength      int    `yaml:"maxLength,omitempty"`
	Description    string `yaml:"description,omitempty"`
	XPrimaryKey    bool   `yaml:"x-primary-key,omitempty"`
	XAutoIncrement bool   `yaml:"x-auto-increment,omitempty"`
}

// ===== 型変換 =====

func convertType(dbType string) (string, string, int) {
	lower := strings.ToLower(dbType)

	if strings.HasPrefix(lower, "bigint") {
		return "integer", "int64", 0
	}
	if strings.HasPrefix(lower, "int") {
		return "integer", "", 0
	}
	if strings.HasPrefix(lower, "varchar") {
		re := regexp.MustCompile(`\((\d+)\)`)
		match := re.FindStringSubmatch(lower)
		if len(match) > 1 {
			return "string", "", atoi(match[1])
		}
		return "string", "", 0
	}
	if lower == "text" {
		return "string", "", 0
	}
	if lower == "datetime" {
		return "string", "date-time", 0
	}
	if lower == "date" {
		return "string", "date", 0
	}
	if lower == "boolean" {
		return "boolean", "", 0
	}

	return "string", "", 0
}

func atoi(s string) int {
	var i int
	fmt.Sscanf(s, "%d", &i)
	return i
}

func toSchemaName(name string) string {
	return strings.Title(name)
}

// ===== メイン処理 =====

func main() {

	data, err := os.ReadFile("../../docs/schema.yaml")
	if err != nil {
		panic(err)
	}

	var db DBSpec
	if err := yaml.Unmarshal(data, &db); err != nil {
		panic(err)
	}

	openapi := OpenAPI{
		OpenAPI: "3.0.0",
		Info: Info{
			Title: db.Database.Name,
			//Title:   db.Database.Name + " API",
			Version: fmt.Sprintf("%.1f", db.Database.Version),
		},
		Paths: make(map[string]interface{}),
		Components: Components{
			Schemas: make(map[string]Schema),
		},
	}

	for _, table := range db.Tables {

		schema := Schema{
			Type:        "object",
			Description: table.Comment,
			Properties:  make(map[string]Property),
			XTableName:  table.Name,
		}

		for _, col := range table.Columns {

			t, f, maxLen := convertType(col.Type)

			prop := Property{
				Type:           t,
				Format:         f,
				MaxLength:      maxLen,
				Description:    col.Comment,
				XPrimaryKey:    col.PK,
				XAutoIncrement: col.AutoIncrement,
			}

			schema.Properties[col.Name] = prop

			if col.NotNull {
				schema.Required = append(schema.Required, col.Name)
			}
		}

		openapi.Components.Schemas[toSchemaName(table.Name)] = schema
	}

	out, err := yaml.Marshal(openapi)
	if err != nil {
		panic(err)
	}

	if err := os.WriteFile("../../docs/schema2openapi.yaml", out, 0644); err != nil {
		panic(err)
	}

	fmt.Println("✅ OpenAPI形式へ変換完了: openapi.yaml を生成しました")
}
