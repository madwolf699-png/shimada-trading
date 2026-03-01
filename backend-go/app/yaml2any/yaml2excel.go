package main

import (
	"fmt"
	"os"
	"time"

	"github.com/xuri/excelize/v2"
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
	Name    string   `yaml:"name"`
	Columns []string `yaml:"columns"`
	Unique  bool     `yaml:"unique"`
}

func main() {
	/*
		if len(os.Args) < 2 {
			fmt.Println("Usage: go run main.go schema.yaml")
			return
		}
	*/
	//data, _ := os.ReadFile(os.Args[1])
	data, _ := os.ReadFile("../../docs/schema.yaml")

	var db Database
	yaml.Unmarshal(data, &db)

	generateExcel(db)

	fmt.Println("実務帳票レベルExcelを生成しました。")
}

func generateExcel(db Database) {

	f := excelize.NewFile()

	for i, table := range db.Tables {

		sheet := table.Name

		if i == 0 {
			f.SetSheetName("Sheet1", sheet)
		} else {
			f.NewSheet(sheet)
		}

		// ===== テーブル情報 =====
		f.SetCellValue(sheet, "A1", "テーブル名")
		f.SetCellValue(sheet, "B1", table.Name)
		f.SetCellValue(sheet, "A2", "コメント")
		f.SetCellValue(sheet, "B2", table.Comment)

		startRow := 4

		headers := []string{
			"No", "カラム名", "型", "PK", "NOT NULL",
			"AUTO_INCREMENT", "DEFAULT", "FK", "コメント",
		}

		for col, val := range headers {
			cell, _ := excelize.CoordinatesToCellName(col+1, startRow)
			f.SetCellValue(sheet, cell, val)
		}

		// ===== スタイル定義 =====
		headerStyle, _ := f.NewStyle(&excelize.Style{
			Font:      &excelize.Font{Bold: true},
			Alignment: &excelize.Alignment{Horizontal: "center"},
			Border: []excelize.Border{
				{Type: "left", Style: 1},
				{Type: "right", Style: 1},
				{Type: "top", Style: 1},
				{Type: "bottom", Style: 1},
			},
		})

		pkStyle, _ := f.NewStyle(&excelize.Style{
			Font: &excelize.Font{Color: "FF0000", Bold: true},
		})

		fkStyle, _ := f.NewStyle(&excelize.Style{
			Font: &excelize.Font{Color: "0000FF"},
		})

		// ヘッダー適用
		f.SetCellStyle(sheet, "A4", "I4", headerStyle)

		// ===== カラム出力 =====
		for i, col := range table.Columns {

			r := startRow + i + 1

			f.SetCellValue(sheet, fmt.Sprintf("A%d", r), i+1)
			f.SetCellValue(sheet, fmt.Sprintf("B%d", r), col.Name)
			f.SetCellValue(sheet, fmt.Sprintf("C%d", r), col.Type)

			if col.PK {
				f.SetCellValue(sheet, fmt.Sprintf("D%d", r), "○")
				f.SetCellStyle(sheet, fmt.Sprintf("B%d", r), fmt.Sprintf("B%d", r), pkStyle)
			}

			if col.NotNull {
				f.SetCellValue(sheet, fmt.Sprintf("E%d", r), "○")
			}

			if col.AutoIncrement {
				f.SetCellValue(sheet, fmt.Sprintf("F%d", r), "○")
			}

			if col.Default != nil {
				f.SetCellValue(sheet, fmt.Sprintf("G%d", r), col.Default)
			}

			if col.FK != nil {
				f.SetCellValue(sheet, fmt.Sprintf("H%d", r),
					fmt.Sprintf("%s.%s", col.FK.Table, col.FK.Column))
				f.SetCellStyle(sheet, fmt.Sprintf("H%d", r), fmt.Sprintf("H%d", r), fkStyle)
			}

			f.SetCellValue(sheet, fmt.Sprintf("I%d", r), col.Comment)
		}

		lastRow := startRow + len(table.Columns)

		// フィルタ設定
		/*
			f.AutoFilter(sheet, fmt.Sprintf("A%d", startRow),
				fmt.Sprintf("I%d", lastRow), "")
		*/
		err := f.AutoFilter(
			sheet,
			fmt.Sprintf("A%d:I%d", startRow, lastRow),
			[]excelize.AutoFilterOptions{},
		)
		if err != nil {
			panic(err)
		}

		// 列幅
		f.SetColWidth(sheet, "A", "I", 18)

		// ===== INDEX一覧 =====
		indexStart := lastRow + 3
		f.SetCellValue(sheet, fmt.Sprintf("A%d", indexStart), "INDEX一覧")

		f.SetCellValue(sheet, fmt.Sprintf("A%d", indexStart+1), "名前")
		f.SetCellValue(sheet, fmt.Sprintf("B%d", indexStart+1), "カラム")
		f.SetCellValue(sheet, fmt.Sprintf("C%d", indexStart+1), "UNIQUE")

		for i, idx := range table.Indexes {

			r := indexStart + 2 + i

			f.SetCellValue(sheet, fmt.Sprintf("A%d", r), idx.Name)
			f.SetCellValue(sheet, fmt.Sprintf("B%d", r), idx.Columns)
			if idx.Unique {
				f.SetCellValue(sheet, fmt.Sprintf("C%d", r), "○")
			}
		}
	}

	fileName := fmt.Sprintf("../../docs/DB仕様書_%s.xlsx",
		time.Now().Format("20060102"))

	f.SaveAs(fileName)
}
