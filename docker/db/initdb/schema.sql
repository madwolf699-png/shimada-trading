SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `account_types_master`;
CREATE TABLE `account_types_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  `name` varchar(100) COMMENT '種別名',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='口座種別マスタ';

-- seed data for account_types_master
INSERT INTO `account_types_master` (`id`, `name`) VALUES
  (1, '普通預金'),
  (2, '当座預金');

DROP TABLE IF EXISTS `billing_days_master`;
CREATE TABLE `billing_days_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  `name` varchar(100) NOT NULL COMMENT '請求日名',
  `day` integer NOT NULL COMMENT '請求日',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='請求日マスタ';

-- seed data for billing_days_master
INSERT INTO `billing_days_master` (`id`, `name`, `day`) VALUES
  (1, '31日', 31);

DROP TABLE IF EXISTS `billing_months_master`;
CREATE TABLE `billing_months_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  `name` varchar(100) NOT NULL COMMENT '請求月',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='請求月マスタ';

-- seed data for billing_months_master
INSERT INTO `billing_months_master` (`id`, `name`) VALUES
  (1, '当月');

DROP TABLE IF EXISTS `closing_dates_master`;
CREATE TABLE `closing_dates_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  `name` varchar(100) NOT NULL COMMENT '締日名',
  `day` integer NOT NULL COMMENT '締日',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='締日マスタ';

-- seed data for closing_dates_master
INSERT INTO `closing_dates_master` (`id`, `name`, `day`) VALUES
  (1, '31日', 31);

DROP TABLE IF EXISTS `collaborations_master`;
CREATE TABLE `collaborations_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  `name` varchar(100) NOT NULL COMMENT '連携種別名',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='連携種別マスタ';

-- seed data for collaborations_master
INSERT INTO `collaborations_master` (`id`, `name`) VALUES
  (1, 'JSON');

DROP TABLE IF EXISTS `consumption_tax_shows_master`;
CREATE TABLE `consumption_tax_shows_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  `name` varchar(100) COMMENT '表示形式名',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='消費税表示形式マスタ';

-- seed data for consumption_tax_shows_master
INSERT INTO `consumption_tax_shows_master` (`id`, `name`) VALUES
  (1, '内税'),
  (2, '外税');

DROP TABLE IF EXISTS `fare_aggregations_master`;
CREATE TABLE `fare_aggregations_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  `name` varchar(100) NOT NULL COMMENT '集約名',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='運賃集約マスタ';

-- seed data for fare_aggregations_master
INSERT INTO `fare_aggregations_master` (`id`, `name`) VALUES
  (1, '入庫出庫別');

DROP TABLE IF EXISTS `kinds_master`;
CREATE TABLE `kinds_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  `name` varchar(100) NOT NULL COMMENT '種別名',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='種別マスタ';

-- seed data for kinds_master
INSERT INTO `kinds_master` (`id`, `name`) VALUES
  (1, '請求書');

DROP TABLE IF EXISTS `locations_master`;
CREATE TABLE `locations_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  `code` varchar(100) NOT NULL COMMENT 'ロケーションコード⇒何桁？★',
  `warehouse` varchar(100) NOT NULL COMMENT '倉庫',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='ロケーションマスタ';

DROP TABLE IF EXISTS `roundings_master`;
CREATE TABLE `roundings_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  `name` varchar(100) NOT NULL COMMENT '処理名',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='端数処理マスタ';

-- seed data for roundings_master
INSERT INTO `roundings_master` (`id`, `name`) VALUES
  (1, '切上げ'),
  (2, '四捨五入'),
  (3, '切捨て');

DROP TABLE IF EXISTS `shippings_master`;
CREATE TABLE `shippings_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  `code` varchar(100) NOT NULL COMMENT '荷主コード⇒何桁？★別マスタが必要？',
  `name` varchar(100) NOT NULL COMMENT '荷主名',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='荷主マスタ';

DROP TABLE IF EXISTS `departments_master`;
CREATE TABLE `departments_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  `shipping_id` bigint NOT NULL COMMENT '荷主コード',
  `code` varchar(100) NOT NULL COMMENT '部門コード⇒何桁？★',
  `name` varchar(100) NOT NULL COMMENT '部門名称',
  `charge_name` varchar(100) NOT NULL COMMENT '責任者名',
  `email` varchar(100) NOT NULL COMMENT 'メールアドレス',
  `warehouse_code` varchar(100) NOT NULL COMMENT '倉庫コード',
  `district` varchar(100) NOT NULL COMMENT '地区⇒マスタが必要？★',
  `order_selection_category` varchar(100) NOT NULL COMMENT 'オーダー選択区分⇒マスタが必要？★',
  `channels` varchar(100) NOT NULL COMMENT '取扱チャンネル⇒マスタが必要？★',
  `expense_claims` varchar(100) NOT NULL COMMENT '経費請求⇒マスタが必要？★',
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_departments_master_shipping_id` FOREIGN KEY (`shipping_id`) REFERENCES `shippings_master`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='部門マスタ';

DROP TABLE IF EXISTS `approval_flows_master`;
CREATE TABLE `approval_flows_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  `department_id` bigint COMMENT '部門ID⇒部門マスターとのリレーション？★',
  `name_1` varchar(100) NOT NULL COMMENT '承認者１',
  `name_2` varchar(100) NOT NULL COMMENT '承認者２',
  `name_3` varchar(100) NOT NULL COMMENT '承認者３',
  `name_4` varchar(100) NOT NULL COMMENT '承認者４',
  `name_5` varchar(100) NOT NULL COMMENT '承認者５',
  `valid_flag` boolean NOT NULL DEFAULT true COMMENT '有効無効',
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_approval_flows_master_department_id` FOREIGN KEY (`department_id`) REFERENCES `departments_master`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='承認フローマスタ';

DROP TABLE IF EXISTS `billings_master`;
CREATE TABLE `billings_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  `shipping_id` bigint NOT NULL COMMENT '荷主',
  `closing_date_id` bigint NOT NULL COMMENT '締日',
  `billing_date_kind` bigint NOT NULL COMMENT '請求月',
  `billing_date_id` bigint NOT NULL COMMENT '請求日',
  `billing_department_id` bigint NOT NULL COMMENT '請求先部門',
  `transfer_financial_institution` varchar(100) NOT NULL COMMENT '振込先金融機関名称',
  `account_type` bigint NOT NULL COMMENT '口座種別',
  `account_number` varchar(30) NOT NULL COMMENT '口座番号',
  `account_name` varchar(100) NOT NULL COMMENT '口座名義',
  `consumption_tax_show_id` bigint NOT NULL COMMENT '消費税',
  `rounding_id` bigint NOT NULL COMMENT '端数処理(円未満)',
  `fare_aggregation_id` bigint NOT NULL COMMENT '運賃集約',
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_billings_master_shipping_id` FOREIGN KEY (`shipping_id`) REFERENCES `shippings_master`(`id`),
  CONSTRAINT `fk_billings_master_closing_date_id` FOREIGN KEY (`closing_date_id`) REFERENCES `closing_dates_master`(`id`),
  CONSTRAINT `fk_billings_master_billing_date_kind` FOREIGN KEY (`billing_date_kind`) REFERENCES `billing_months_master`(`id`),
  CONSTRAINT `fk_billings_master_billing_date_id` FOREIGN KEY (`billing_date_id`) REFERENCES `billing_days_master`(`id`),
  CONSTRAINT `fk_billings_master_billing_department_id` FOREIGN KEY (`billing_department_id`) REFERENCES `departments_master`(`id`),
  CONSTRAINT `fk_billings_master_account_type` FOREIGN KEY (`account_type`) REFERENCES `account_types_master`(`id`),
  CONSTRAINT `fk_billings_master_consumption_tax_show_id` FOREIGN KEY (`consumption_tax_show_id`) REFERENCES `consumption_tax_shows_master`(`id`),
  CONSTRAINT `fk_billings_master_rounding_id` FOREIGN KEY (`rounding_id`) REFERENCES `roundings_master`(`id`),
  CONSTRAINT `fk_billings_master_fare_aggregation_id` FOREIGN KEY (`fare_aggregation_id`) REFERENCES `fare_aggregations_master`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='請求マスタ⇒1-17-11の請求項目との連携は未★';

DROP TABLE IF EXISTS `consumption_tax_rates_master`;
CREATE TABLE `consumption_tax_rates_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  `code` varchar(100) NOT NULL COMMENT 'コード⇒このコードはどこで使用される？★',
  `tax_rate` decimal(5,2) NOT NULL COMMENT '税率',
  `effective_start_date` date NOT NULL COMMENT '有効開始日',
  `remarks` varchar(100) COMMENT '備考',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='消費税率保守マスタ';

-- seed data for consumption_tax_rates_master
INSERT INTO `consumption_tax_rates_master` (`id`, `code`, `tax_rate`, `effective_start_date`, `remarks`) VALUES
  (1, '01', 3, '1989-04-01', '3%'),
  (2, '02', 5, '1907-04-01', '5%'),
  (3, '03', 8, '2014-04-01', '8%'),
  (4, '04', 10, '2019-10-01', '10%');

DROP TABLE IF EXISTS `customers_master`;
CREATE TABLE `customers_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  `code` varchar(100) NOT NULL COMMENT '利用者コード',
  `class` varchar(100) NOT NULL COMMENT '分類⇒分類マスタが必要★',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='利用者マスタ';

DROP TABLE IF EXISTS `customers_info_master`;
CREATE TABLE `customers_info_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  `user_id` bigint COMMENT '利用者ID',
  `name` varchar(100) NOT NULL COMMENT '名称',
  `abbreviation` varchar(100) COMMENT '略称',
  `post_code` varchar(8) NOT NULL COMMENT '郵便番号',
  `prefecture` varchar(20) NOT NULL COMMENT '県',
  `country` varchar(100) NOT NULL COMMENT '市',
  `address_1` varchar(100) NOT NULL COMMENT '住所１',
  `address_2` varchar(100) COMMENT '住所２',
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_customers_info_master_user_id` FOREIGN KEY (`user_id`) REFERENCES `customers_master`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='利用者情報マスタ';

DROP TABLE IF EXISTS `delivery_companys_master`;
CREATE TABLE `delivery_companys_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  `code` varchar(100) NOT NULL COMMENT '配送業者コード⇒何桁？★',
  `name` varchar(100) NOT NULL COMMENT '配送業者名称',
  `abbreviation` varchar(100) COMMENT '配送業者略称',
  `kubun` boolean NOT NULL DEFAULT true COMMENT '自車・備車区分⇒マスタが必要？★',
  `tel` varchar(100) COMMENT '電話番号',
  `package_tracking_url` varchar(100) COMMENT '荷物追跡用URL',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='配送業者マスタ';

DROP TABLE IF EXISTS `entry_and_exit_fees_master`;
CREATE TABLE `entry_and_exit_fees_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  `code` varchar(100) NOT NULL COMMENT 'コード⇒何桁？★',
  `name` varchar(100) NOT NULL COMMENT '名称',
  `cost` bigint NOT NULL COMMENT '費用',
  `remarks` varchar(100) COMMENT '備考',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='入出庫料金マスタ';

DROP TABLE IF EXISTS `external_collaborations_master`;
CREATE TABLE `external_collaborations_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  `name` varchar(100) NOT NULL COMMENT '外部連携名',
  `kind_id` bigint NOT NULL COMMENT '種別',
  `collaboration_id` bigint NOT NULL COMMENT '連携種別',
  `valid_flag` boolean NOT NULL DEFAULT true COMMENT '有効無効',
  `form` text COMMENT 'フォーム',
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_external_collaborations_master_kind_id` FOREIGN KEY (`kind_id`) REFERENCES `kinds_master`(`id`),
  CONSTRAINT `fk_external_collaborations_master_collaboration_id` FOREIGN KEY (`collaboration_id`) REFERENCES `collaborations_master`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='外部連携マスタ⇒1-17-22の連携項目との連携が未★';

DROP TABLE IF EXISTS `groups_master`;
CREATE TABLE `groups_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  `name` varchar(100) NOT NULL COMMENT 'グループ名',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='グループマスタ';

DROP TABLE IF EXISTS `items_master`;
CREATE TABLE `items_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  `photo_file_name` varchar(255) NOT NULL COMMENT '写真ファイル名',
  `photo_file_data` mediumblob NOT NULL COMMENT '写真ファイル本体（画像・Excel）',
  `photo_mime_type` varchar(100) NOT NULL COMMENT '写真MIMEタイプ',
  `doc_file_name` varchar(255) NOT NULL COMMENT '仕様書ファイル名',
  `doc_file_data` mediumblob NOT NULL COMMENT '仕様書ファイル本体（画像・Excel）',
  `doc_mime_type` varchar(100) NOT NULL COMMENT '仕様書MIMEタイプ',
  `public_division` integer COMMENT '公開区分⇒マスタが必要？★',
  `department_id` bigint COMMENT '部門コード',
  `product_code` varchar(100) COMMENT '商品コード',
  `product_name` varchar(100) COMMENT '商品名所',
  `product_abbreviation` varchar(100) COMMENT '商品略称',
  `management_method` integer COMMENT '管理方法⇒マスタが必要？★',
  `shipping_order_unit_quantity` integer COMMENT '出荷(受注)単位数量',
  `packing_unit_quantity` integer COMMENT '梱包単位(数量)',
  `product_division_for_others` integer COMMENT '他者扱い商品区分⇒マスタが必要？★',
  `supplier_Code` integer COMMENT '仕入先コード⇒マスタが必要？★',
  `made_to_order_production_category` integer COMMENT '受注生産区分⇒マスタが必要？★',
  `production_lead_time_in_days` integer COMMENT '生産リードタイム日数',
  `solid_management_category` integer COMMENT '固体管理区分⇒マスタが必要？★',
  `jan_code` varchar(100) COMMENT 'JANコード',
  `product_division` integer COMMENT '商品区分⇒マスタが必要？★',
  `quantity` integer COMMENT '入り数',
  `delivery_by_courier_available` integer COMMENT '宅配便発送可否⇒マスタが必要？★',
  `inventory_quantity_management_category` integer COMMENT '在庫数量管理区分⇒マスタが必要？★',
  `shipping_form` integer COMMENT '出荷形態⇒マスタが必要？★',
  `location` varchar(100) COMMENT 'ロケーション',
  `outgoing_shelf` integer COMMENT '出庫棚⇒マスタが必要？★',
  `inventory_shelf` integer COMMENT '在庫棚⇒マスタが必要？★',
  `rental_item_categories` integer COMMENT 'レンタル品区分⇒マスタが必要？★',
  `product_classification` integer COMMENT '商品分類⇒マスタが必要？★',
  `product_category` integer COMMENT '商品カテゴリ⇒マスタが必要？★',
  `order_number` integer COMMENT '順序番号',
  `set_product_category` integer COMMENT 'セット品区分⇒マスタが必要？★',
  `fare_category` integer COMMENT '運賃区分⇒マスタが必要？★',
  `inventory_unit_price` integer COMMENT '在庫単価',
  `currency_Unit` integer COMMENT '通過単位⇒マスタが必要？★',
  `packing_fee` decimal(10,2) COMMENT '梱包料金',
  `material_cost` decimal(10,2) COMMENT '資材料金',
  `receipt_amount_calculation_division` integer COMMENT '入庫量計算区分⇒マスタが必要？★',
  `issue_amount_calculation_division` integer COMMENT '出庫量計算区分⇒マスタが必要？★',
  `unit` integer COMMENT '単位⇒マスタが必要？★',
  `automatic_allocation_stop_inventory_quantity` decimal(10,2) COMMENT '自動引当停止在庫数量',
  `automatic_allocation_availability_category` integer COMMENT '自動引当可否区分⇒マスタが必要？★',
  `order_reception` integer NOT NULL COMMENT 'オーダー受付⇒マスタが必要？★',
  `regular_consumables_category` integer NOT NULL COMMENT '通常消耗品区分⇒マスタが必要？★',
  `rare_item_division` integer NOT NULL COMMENT '希少品区分⇒マスタが必要？★',
  `expected_arrival_date` date COMMENT '入庫予定日',
  `first_stock_date` date COMMENT '初回入庫日',
  `comment_1` varchar(100) COMMENT 'コメント１',
  `comment_2` varchar(100) COMMENT 'コメント２',
  `comment_3` varchar(100) COMMENT 'コメント３',
  `comment_4` varchar(100) COMMENT 'コメント４',
  `comment_5` varchar(100) COMMENT 'コメント５',
  `remarks` varchar(100) COMMENT '備考',
  `actual_weight` decimal(10,2) COMMENT '実重量',
  `volumetric_weight` decimal(10,2) COMMENT '容積重量',
  `logistics_volume` decimal(10,2) COMMENT '物流量',
  `volume_amount` decimal(10,2) COMMENT '容積重',
  `size_w` decimal(10,2) COMMENT '寸法　W',
  `size_d` decimal(10,2) COMMENT '寸法　D',
  `size_h` decimal(10,2) COMMENT '寸法　H',
  `actual_size_weight` decimal(10,2) COMMENT '実寸　重量',
  `actual_size_volume` decimal(10,2) COMMENT '実寸　容積',
  `packing_style_vertical` decimal(10,2) COMMENT '荷姿　縦',
  `packing_style_width` decimal(10,2) COMMENT '荷姿　横',
  `packing_style_height` decimal(10,2) COMMENT '荷姿　高',
  `packing_style_weight` decimal(10,2) COMMENT '荷姿　重量',
  `packing_style_volume` decimal(10,2) COMMENT '荷姿　容積',
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_items_master_department_id` FOREIGN KEY (`department_id`) REFERENCES `departments_master`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='アイテムマスタ⇒QRコードについて未？★';

DROP TABLE IF EXISTS `mobile_devices_master`;
CREATE TABLE `mobile_devices_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  `name` varchar(100) NOT NULL COMMENT '端末名称',
  `mac_address` varchar(100) NOT NULL COMMENT 'MACアドレス',
  `valid_flag` boolean NOT NULL DEFAULT true COMMENT '有効無効',
  `remarks` varchar(100) COMMENT '備考',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='モバイル端末マスタ';

DROP TABLE IF EXISTS `order_deadlines_master`;
CREATE TABLE `order_deadlines_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  `name` varchar(200) NOT NULL COMMENT '時刻種別名',
  `time` varchar(100) NOT NULL COMMENT '時刻',
  `valid_flag` boolean NOT NULL DEFAULT true COMMENT '有効無効',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='受注締切時刻保守マスタ';

-- seed data for order_deadlines_master
INSERT INTO `order_deadlines_master` (`id`, `name`, `time`, `valid_flag`) VALUES
  (1, '受注締切時刻', '12:00', true),
  (2, 'オーダーエントリ中の猶予時刻（受注締切時刻の5分後）', '12:05', true),
  (3, '緊急出庫基準時刻', '48:00', true);

DROP TABLE IF EXISTS `packing_sizes_master`;
CREATE TABLE `packing_sizes_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  `code` varchar(100) NOT NULL COMMENT 'コード⇒何桁？★',
  `name` varchar(100) NOT NULL COMMENT '名称',
  `remarks` varchar(100) COMMENT '備考',
  `order` int NOT NULL COMMENT '順序',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='梱包サイズマスタ';

DROP TABLE IF EXISTS `product_categories_master`;
CREATE TABLE `product_categories_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  `code` varchar(100) NOT NULL COMMENT 'コード⇒何桁？★',
  `name` varchar(100) NOT NULL COMMENT '名称',
  `remarks` varchar(100) COMMENT '備考',
  `order` int NOT NULL COMMENT '順序',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品カテゴリマスタ';

DROP TABLE IF EXISTS `product_units_master`;
CREATE TABLE `product_units_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  `code` varchar(100) NOT NULL COMMENT 'コード⇒何桁？★',
  `name` varchar(100) NOT NULL COMMENT '名称',
  `remarks` varchar(100) COMMENT '備考',
  `order` integer NOT NULL COMMENT '順序',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品単位マスタ';

DROP TABLE IF EXISTS `return_and_repair_units_master`;
CREATE TABLE `return_and_repair_units_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  `code` varchar(100) NOT NULL COMMENT 'コード⇒何桁？★',
  `name` varchar(100) NOT NULL COMMENT '名称',
  `remarks` varchar(100) COMMENT '備考',
  `order` int NOT NULL COMMENT '順序',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='返却入庫補修単位マスタ';

DROP TABLE IF EXISTS `services_useds_master`;
CREATE TABLE `services_useds_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  `name` varchar(100) NOT NULL COMMENT 'サービス名',
  `billing_date` date NOT NULL COMMENT '請求日',
  `amount` bigint NOT NULL COMMENT '金額',
  `activation_time` timestamp NOT NULL COMMENT '有効化日時',
  `invalidation_time` timestamp NOT NULL COMMENT '無効化日時',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='利用サービスマスタ⇒1-17-21の定義が未★';

DROP TABLE IF EXISTS `set_items_master`;
CREATE TABLE `set_items_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  `public_division` boolean NOT NULL DEFAULT true COMMENT '公開区分⇒マスタが必要？★',
  `department_id` bigint NOT NULL COMMENT '部門ID',
  `code` varchar(100) NOT NULL COMMENT 'セットアイテムコード',
  `name` varchar(100) NOT NULL COMMENT 'セットアイテム名称',
  `comment_1` varchar(100) COMMENT 'コメント１',
  `comment_2` varchar(100) COMMENT 'コメント２',
  `comment_3` varchar(100) COMMENT 'コメント３',
  `comment_4` varchar(100) COMMENT 'コメント４',
  `comment_5` varchar(100) COMMENT 'コメント５',
  `remarks` varchar(100) COMMENT '備考',
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_set_items_master_department_id` FOREIGN KEY (`department_id`) REFERENCES `departments_master`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='セットアイテムマスタ';

DROP TABLE IF EXISTS `set_items_product_units_master`;
CREATE TABLE `set_items_product_units_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  `set_item_id` bigint NOT NULL COMMENT 'アイテムID',
  `product_unit_id` bigint NOT NULL COMMENT '商品ID⇒何桁？★',
  `quantity` integer NOT NULL COMMENT '数量',
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_set_items_product_units_master_set_item_id` FOREIGN KEY (`set_item_id`) REFERENCES `set_items_master`(`id`),
  CONSTRAINT `fk_set_items_product_units_master_product_unit_id` FOREIGN KEY (`product_unit_id`) REFERENCES `product_units_master`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='セットアイテム商品マスタ';

DROP TABLE IF EXISTS `shipping_fees_master`;
CREATE TABLE `shipping_fees_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='配送料金マスタ⇒1-17-9の内容が不明？★';

DROP TABLE IF EXISTS `stores_master`;
CREATE TABLE `stores_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  `code` varchar(100) NOT NULL COMMENT '店舗コード⇒何桁？★',
  `abbreviation` varchar(100) NOT NULL COMMENT '店舗略称',
  `name_1` varchar(100) COMMENT '店舗名称１',
  `name_2` varchar(100) COMMENT '店舗名称２',
  `post_code` varchar(8) NOT NULL COMMENT '郵便番号',
  `prefecture` varchar(20) NOT NULL COMMENT '県',
  `country` varchar(100) NOT NULL COMMENT '市',
  `address_1` varchar(100) NOT NULL COMMENT '住所１',
  `address_2` varchar(100) COMMENT '住所２',
  `tel` varchar(20) NOT NULL COMMENT '電話番号',
  `fax` varchar(20) NOT NULL COMMENT 'FAX番号',
  `designated_delivery_company` varchar(100) COMMENT '指定配送業者名',
  `email` varchar(100) COMMENT '店舗メールアドレス',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='店舗マスタ';

DROP TABLE IF EXISTS `system_mail_settings_master`;
CREATE TABLE `system_mail_settings_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  `code` varchar(100) NOT NULL COMMENT 'コード⇒何桁？★',
  `title` varchar(100) NOT NULL COMMENT 'タイトル',
  `body` text NOT NULL COMMENT '本文',
  `email_from` varchar(100) NOT NULL COMMENT '送信元メールアドレス',
  `remarks` text COMMENT '備考',
  `valid_flag` boolean NOT NULL DEFAULT true COMMENT '有効無効',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='システムメール設定マスタ';

DROP TABLE IF EXISTS `users_master`;
CREATE TABLE `users_master` (
  `id` bigint AUTO_INCREMENT NOT NULL COMMENT 'ID',
  `group_id` bigint NOT NULL COMMENT 'グループID',
  `user_id` varchar(100) NOT NULL COMMENT 'ユーザID',
  `name` varchar(100) NOT NULL COMMENT 'ユーザ名',
  `email` varchar(100) NOT NULL COMMENT 'メールアドレス',
  `department_id` bigint NOT NULL COMMENT '所属ID',
  `valid_flag` boolean NOT NULL DEFAULT true COMMENT '有効無効',
  `one_time_passwd` varchar(100) NOT NULL COMMENT 'ワンタイムパスワード',
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_users_master_group_id` FOREIGN KEY (`group_id`) REFERENCES `groups_master`(`id`),
  CONSTRAINT `fk_users_master_department_id` FOREIGN KEY (`department_id`) REFERENCES `departments_master`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='ユーザマスタ⇒1-17-3について検討未？★';

SET FOREIGN_KEY_CHECKS = 1;
