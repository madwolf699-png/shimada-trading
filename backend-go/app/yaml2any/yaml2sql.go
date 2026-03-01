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
	Indexes []Index  `yaml:"indexes"`
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

type Index struct {
	Name     string   `yaml:"name"`
	Columns  []string `yaml:"columns"`
	Unique   bool     `yaml:"unique"`
	Fulltext bool     `yaml:"fulltext"`
	Spatial  bool     `yaml:"spatial"`
}

func main() {
	/*
		if len(os.Args) < 2 {
			fmt.Println("Usage: go run main.go schema.yaml")
			return
		}
	*/
	//data, err := os.ReadFile(os.Args[1])
	data, err := os.ReadFile("../../docs/schema.yaml")
	if err != nil {
		panic(err)
	}

	var db Database
	if err := yaml.Unmarshal(data, &db); err != nil {
		panic(err)
	}

	generateSQL(db)

	fmt.Println("schema.sql を生成しました。")
}

func generateSQL(db Database) {

	var sb strings.Builder

	sb.WriteString("SET FOREIGN_KEY_CHECKS = 0;\n\n")

	for _, table := range db.Tables {

		sb.WriteString(fmt.Sprintf("DROP TABLE IF EXISTS `%s`;\n", table.Name))
		sb.WriteString(fmt.Sprintf("CREATE TABLE `%s` (\n", table.Name))

		var pkList []string
		var fkList []string
		var indexLines []string

		for _, col := range table.Columns {

			sb.WriteString("  `" + col.Name + "` " + col.Type)

			if col.AutoIncrement {
				sb.WriteString(" AUTO_INCREMENT")
			}

			if col.NotNull {
				sb.WriteString(" NOT NULL")
			}

			if col.Default != nil {
				sb.WriteString(" DEFAULT " + formatDefault(col.Default))
			}

			if col.Comment != "" {
				sb.WriteString(" COMMENT '" + col.Comment + "'")
			}

			sb.WriteString(",\n")

			if col.PK {
				pkList = append(pkList, "`"+col.Name+"`")
			}

			if col.FK != nil {
				fk := fmt.Sprintf(
					"  CONSTRAINT `fk_%s_%s` FOREIGN KEY (`%s`) REFERENCES `%s`(`%s`)",
					table.Name,
					col.Name,
					col.Name,
					col.FK.Table,
					col.FK.Column,
				)
				fkList = append(fkList, fk)
			}
		}

		if len(pkList) > 0 {
			indexLines = append(indexLines,
				"  PRIMARY KEY ("+strings.Join(pkList, ", ")+")")
		}

		for _, fk := range fkList {
			indexLines = append(indexLines, fk)
		}

		for _, idx := range table.Indexes {

			indexType := "INDEX"
			if idx.Unique {
				indexType = "UNIQUE INDEX"
			}
			if idx.Fulltext {
				indexType = "FULLTEXT INDEX"
			}
			if idx.Spatial {
				indexType = "SPATIAL INDEX"
			}

			line := fmt.Sprintf(
				"  %s `%s` (%s)",
				indexType,
				idx.Name,
				formatColumns(idx.Columns),
			)
			indexLines = append(indexLines, line)
		}

		sb.WriteString(strings.Join(indexLines, ",\n"))
		sb.WriteString("\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4")

		if table.Comment != "" {
			sb.WriteString(" COMMENT='" + table.Comment + "'")
		}

		sb.WriteString(";\n\n")
	}

	sb.WriteString("SET FOREIGN_KEY_CHECKS = 1;\n")

	os.WriteFile("../../docs/schema.sql", []byte(sb.String()), 0644)
}

func formatColumns(cols []string) string {
	var quoted []string
	for _, c := range cols {
		quoted = append(quoted, "`"+c+"`")
	}
	return strings.Join(quoted, ", ")
}

func formatDefault(def interface{}) string {
	switch v := def.(type) {
	case string:
		return "'" + v + "'"
	case bool:
		if v {
			return "true"
		}
		return "false"
	default:
		return fmt.Sprintf("%v", v)
	}
}
