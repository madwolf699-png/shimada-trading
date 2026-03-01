package main

import (
	"fmt"
	"os"
	"strings"

	"gopkg.in/yaml.v3"
)

type Database struct {
	Database struct {
		Name    string  `yaml:"name"`
		Version float64 `yaml:"version"`
	} `yaml:"database"`
	Tables []Table `yaml:"tables"`
}

type Table struct {
	Name    string   `yaml:"name"`
	Comment string   `yaml:"comment"`
	Columns []Column `yaml:"columns"`
}

type Column struct {
	Name          string      `yaml:"name"`
	Type          string      `yaml:"type"`
	PK            bool        `yaml:"pk"`
	NotNull       bool        `yaml:"not_null"`
	AutoIncrement bool        `yaml:"auto_increment"`
	Default       interface{} `yaml:"default"`
	Comment       string      `yaml:"comment"`
	FK            *FK         `yaml:"fk"`
}

type FK struct {
	Table  string `yaml:"table"`
	Column string `yaml:"column"`
}

func main() {
	/*
		if len(os.Args) < 2 {
			fmt.Println("Usage: go run main.go schema.yaml")
			return
		}

		yamlFile := os.Args[1]
	*/

	//data, err := os.ReadFile(yamlFile)
	data, err := os.ReadFile("../../docs/schema.yaml")
	if err != nil {
		panic(err)
	}

	var db Database
	err = yaml.Unmarshal(data, &db)
	if err != nil {
		panic(err)
	}

	generatePlantUML(db)
	generateMarkdown(db)

	fmt.Println("ER図 (er.puml) と 定義書 (schema.md) を生成しました。")
}

func generatePlantUML(db Database) {

	var sb strings.Builder

	sb.WriteString("@startuml\n")
	sb.WriteString("hide circle\n")
	sb.WriteString("skinparam linetype ortho\n\n")

	for _, table := range db.Tables {
		//sb.WriteString(fmt.Sprintf("entity %s {\n", table.Name))
		sb.WriteString(fmt.Sprintf(
			"entity %s as \"%s\\n[%s]\" {\n",
			table.Name,
			table.Name,
			table.Comment,
		))
		for _, col := range table.Columns {
			line := "  "

			if col.PK {
				line += "+"
			}

			line += col.Name + " : " + col.Type

			if col.PK {
				line += " <<PK>>"
			}
			if col.FK != nil {
				line += " <<FK>>"
			}

			if col.Comment != "" {
				line += "  // " + col.Comment
			}

			sb.WriteString(line + "\n")
		}

		sb.WriteString("}\n\n")
	}

	// リレーション
	for _, table := range db.Tables {
		for _, col := range table.Columns {
			if col.FK != nil {
				sb.WriteString(fmt.Sprintf("%s ||--o{ %s\n",
					col.FK.Table,
					table.Name))
			}
		}
	}

	sb.WriteString("\n@enduml")

	os.WriteFile("../../docs/schema_er.puml", []byte(sb.String()), 0644)
}

func generateMarkdown(db Database) {

	var sb strings.Builder

	sb.WriteString(fmt.Sprintf("# %s\n\n", db.Database.Name))

	for _, table := range db.Tables {

		sb.WriteString(fmt.Sprintf("## %s（%s）\n\n", table.Name, table.Comment))
		sb.WriteString("| カラム名 | 型 | PK | FK | NOT NULL | DEFAULT | 説明 |\n")
		sb.WriteString("|----------|----|----|----|----------|----------|------|\n")

		for _, col := range table.Columns {

			pk := "-"
			if col.PK {
				pk = "○"
			}

			fk := "-"
			if col.FK != nil {
				fk = col.FK.Table + "." + col.FK.Column
			}

			notNull := "-"
			if col.NotNull {
				notNull = "○"
			}

			def := "-"
			if col.Default != nil {
				def = fmt.Sprintf("%v", col.Default)
			}

			sb.WriteString(fmt.Sprintf("| %s | %s | %s | %s | %s | %s | %s |\n",
				col.Name,
				col.Type,
				pk,
				fk,
				notNull,
				def,
				col.Comment,
			))
		}

		sb.WriteString("\n")
	}

	os.WriteFile("../../docs/schema.md", []byte(sb.String()), 0644)
}
