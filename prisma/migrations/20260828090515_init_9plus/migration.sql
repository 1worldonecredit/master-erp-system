-- CreateTable
CREATE TABLE "bank_statements" (
    "statement_id" SERIAL NOT NULL,
    "bank_id" INTEGER NOT NULL,
    "bank_name" VARCHAR(100),
    "account_number" VARCHAR(50),
    "amount" DECIMAL(18,2),
    "transfer_date" DATE NOT NULL,
    "transfer_time" TIME(6) NOT NULL,
    "recorded_by" VARCHAR(100),
    "is_reconciled" BIT(1),
    "reconciled_with_deposit_id" INTEGER,
    "created_at" TIMESTAMP(6),

    CONSTRAINT "bank_statements_pkey" PRIMARY KEY ("statement_id")
);

-- CreateTable
CREATE TABLE "banks" (
    "bank_id" SERIAL NOT NULL,
    "bank_name" VARCHAR(100),
    "bank_code" VARCHAR(20),
    "logo_url" VARCHAR,
    "is_active" BIT(1),
    "created_at" TIMESTAMP(6),
    "account_number" VARCHAR(50),
    "account_name" VARCHAR(100),
    "currency" VARCHAR(10),
    "country" VARCHAR(50),

    CONSTRAINT "banks_pkey" PRIMARY KEY ("bank_id")
);

-- CreateTable
CREATE TABLE "blocked_ips" (
    "id" SERIAL NOT NULL,
    "ip_address" VARCHAR(50),
    "reason" VARCHAR(255),
    "is_blocked" BIT(1),
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "blocked_ips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commission_settings" (
    "id" SERIAL NOT NULL,
    "purchase_percent" DECIMAL(5,2),
    "win_percent" DECIMAL(5,2),
    "daily_bonus_percent" DECIMAL(5,2),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "commission_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customerlevels" (
    "level_id" SERIAL NOT NULL,
    "level_name" VARCHAR(50),
    "min_spent" DECIMAL(18,2),
    "max_spent" DECIMAL(18,2),

    CONSTRAINT "customerlevels_pkey" PRIMARY KEY ("level_id")
);

-- CreateTable
CREATE TABLE "draw_results" (
    "draw_date" DATE NOT NULL,
    "prize_8" VARCHAR(8),
    "prize_6" VARCHAR(6),
    "prize_4" VARCHAR(4),
    "prize_3" VARCHAR(3),
    "prize_2" VARCHAR(2),
    "created_at" TIMESTAMP(6),

    CONSTRAINT "draw_results_pkey" PRIMARY KEY ("draw_date")
);

-- CreateTable
CREATE TABLE "emp_branches" (
    "branch_code" VARCHAR(10) NOT NULL,
    "branch_name" VARCHAR(100),
    "country_code" VARCHAR(2),

    CONSTRAINT "emp_branches_pkey" PRIMARY KEY ("branch_code")
);

-- CreateTable
CREATE TABLE "emp_countries" (
    "country_code" VARCHAR(2) NOT NULL,
    "country_name" VARCHAR(100),

    CONSTRAINT "emp_countries_pkey" PRIMARY KEY ("country_code")
);

-- CreateTable
CREATE TABLE "emp_departments" (
    "dept_code" VARCHAR(10) NOT NULL,
    "dept_name" VARCHAR(100),

    CONSTRAINT "emp_departments_pkey" PRIMARY KEY ("dept_code")
);

-- CreateTable
CREATE TABLE "emp_positions" (
    "position_code" VARCHAR(10) NOT NULL,
    "position_name" VARCHAR(100),
    "dept_code" VARCHAR(10),
    "base_salary" DECIMAL(18,2),
    "hourly_rate" DECIMAL(18,2),
    "ot_multiplier" DECIMAL(4,2),
    "job_responsibilities" VARCHAR,

    CONSTRAINT "emp_positions_pkey" PRIMARY KEY ("position_code")
);

-- CreateTable
CREATE TABLE "employees" (
    "emp_code" VARCHAR(20) NOT NULL,
    "username" VARCHAR(50),
    "password_hash" VARCHAR(255),
    "firstname" VARCHAR(100),
    "lastname" VARCHAR(100),
    "branch_code" VARCHAR(10),
    "position_code" VARCHAR(10),
    "employment_type" VARCHAR(20),
    "role_id" INTEGER,
    "status" VARCHAR(20),
    "created_at" TIMESTAMP(6),
    "expected_salary" DECIMAL(18,2),
    "special_skills" VARCHAR,
    "why_hire_you" VARCHAR,
    "education_doc_url" VARCHAR,
    "profile_pic_url" VARCHAR,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("emp_code")
);

-- CreateTable
CREATE TABLE "exchangerates" (
    "currency_pair" VARCHAR(10) NOT NULL,
    "rate" DECIMAL(18,6),
    "last_updated" TIMESTAMP(6),

    CONSTRAINT "exchangerates_pkey" PRIMARY KEY ("currency_pair")
);

-- CreateTable
CREATE TABLE "job_ads_settings" (
    "id" SERIAL NOT NULL,
    "is_active" BIT(1),
    "ad_title" VARCHAR(255),
    "ad_description" VARCHAR,
    "end_time" TIMESTAMP(6),
    "start_time" TIMESTAMP(6),
    "allowed_positions" VARCHAR,

    CONSTRAINT "job_ads_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "login_failed_attempts" (
    "id" SERIAL NOT NULL,
    "ip_address" VARCHAR(50),
    "attempt_time" TIMESTAMP(6),

    CONSTRAINT "login_failed_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lottery_order_items" (
    "item_id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "lottery_type" VARCHAR(50),
    "selected_number" VARCHAR(20),
    "price" DECIMAL(18,2),
    "status" VARCHAR(50),
    "prize_amount" DECIMAL(18,2),

    CONSTRAINT "lottery_order_items_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "lottery_orders" (
    "order_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "total_amount" DECIMAL(18,2),
    "currency_code" VARCHAR(10),
    "status" VARCHAR(50),
    "created_at" TIMESTAMP(6),
    "draw_date" DATE,
    "order_note" VARCHAR,

    CONSTRAINT "lottery_orders_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "lottery_prize_rates" (
    "id" SERIAL NOT NULL,
    "lottery_type" VARCHAR(10),
    "multiplier" DECIMAL(10,2),
    "description" VARCHAR(255),

    CONSTRAINT "lottery_prize_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master_animal_numbers" (
    "animal_id" SERIAL NOT NULL,
    "animal_name_th" VARCHAR(100),
    "image_url" VARCHAR NOT NULL,
    "lottery_type" VARCHAR(10),
    "num1" VARCHAR(10),
    "num2" VARCHAR(10),
    "num3" VARCHAR(10),
    "is_active" BIT(1),
    "created_at" TIMESTAMP(6),
    "created_by" VARCHAR(100),
    "updated_by" VARCHAR(100),

    CONSTRAINT "master_animal_numbers_pkey" PRIMARY KEY ("animal_id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "notification_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" VARCHAR(255),
    "message" VARCHAR NOT NULL,
    "type" VARCHAR(50),
    "is_read" BIT(1),
    "is_deleted" BIT(1),
    "created_at" TIMESTAMP(6),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "p2p_ads" (
    "ad_id" SERIAL NOT NULL,
    "media_type" VARCHAR(20),
    "media_url" VARCHAR(100),
    "is_active" BIT(1),
    "created_at" TIMESTAMP(6),
    "title" VARCHAR(255),
    "description" VARCHAR,
    "start_time" TIMESTAMP(6),
    "end_time" TIMESTAMP(6),
    "sort_order" INTEGER,

    CONSTRAINT "p2p_ads_pkey" PRIMARY KEY ("ad_id")
);

-- CreateTable
CREATE TABLE "p2p_offenders" (
    "user_id" SERIAL NOT NULL,
    "fail_count" INTEGER,
    "last_offense_date" TIMESTAMP(6),
    "notes" VARCHAR(255),

    CONSTRAINT "p2p_offenders_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "p2p_promotions" (
    "promo_id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "bonus_percent" DECIMAL(5,2),
    "start_time" TIMESTAMP(6) NOT NULL,
    "end_time" TIMESTAMP(6) NOT NULL,
    "created_at" TIMESTAMP(6),

    CONSTRAINT "p2p_promotions_pkey" PRIMARY KEY ("promo_id")
);

-- CreateTable
CREATE TABLE "p2p_requests" (
    "request_id" SERIAL NOT NULL,
    "requester_id" INTEGER NOT NULL,
    "provider_id" INTEGER,
    "request_type" VARCHAR(20),
    "currency" VARCHAR(10),
    "amount" DECIMAL(18,2),
    "bonus_or_fee" DECIMAL(18,2),
    "net_amount" DECIMAL(18,2),
    "provider_reward" DECIMAL(18,2),
    "status" VARCHAR(50),
    "slip_url" VARCHAR,
    "created_at" TIMESTAMP(6),
    "expires_at" TIMESTAMP(6),
    "accepted_at" TIMESTAMP(6),
    "completed_at" TIMESTAMP(6),
    "user_bank_id" INTEGER,
    "transfer_amount" DECIMAL(18,2),
    "transfer_date" DATE,
    "transfer_time" TIME(6),
    "slip_error_count" INTEGER,

    CONSTRAINT "p2p_requests_pkey" PRIMARY KEY ("request_id")
);

-- CreateTable
CREATE TABLE "p2p_settings" (
    "id" SERIAL NOT NULL,
    "deposit_bonus_percent" DECIMAL(5,2),
    "withdraw_fee_percent" DECIMAL(5,2),
    "provider_reward_percent" DECIMAL(5,2),
    "referrer_reward_percent" DECIMAL(5,2),
    "request_timeout_minutes" INTEGER,
    "promo_start_time" TIMESTAMP(6),
    "promo_end_time" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "mission_timeout_minutes" INTEGER,
    "provider_timeout_minutes" INTEGER,

    CONSTRAINT "p2p_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "permission_id" SERIAL NOT NULL,
    "permission_name" VARCHAR(100),

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("permission_id")
);

-- CreateTable
CREATE TABLE "role_menus" (
    "role_id" INTEGER NOT NULL,
    "menu_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "rolepermissions" (
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "roles" (
    "role_id" INTEGER NOT NULL,
    "role_name" VARCHAR(50)
);

-- CreateTable
CREATE TABLE "super_yeeki_jackpot" (
    "jackpot_id" SERIAL NOT NULL,
    "current_amount" DECIMAL(18,2),
    "currency_code" VARCHAR(10),
    "last_updated" TIMESTAMP(6),

    CONSTRAINT "super_yeeki_jackpot_pkey" PRIMARY KEY ("jackpot_id")
);

-- CreateTable
CREATE TABLE "system_menus" (
    "menu_id" SERIAL NOT NULL,
    "title" VARCHAR(100),
    "path" VARCHAR(200),
    "icon" VARCHAR(50),
    "component" VARCHAR(100),
    "parent_id" INTEGER,
    "sort_order" INTEGER,
    "is_active" BIT(1),
    "show_notification" BIT(1),

    CONSTRAINT "system_menus_pkey" PRIMARY KEY ("menu_id")
);

-- CreateTable
CREATE TABLE "system_roles" (
    "role_id" SERIAL NOT NULL,
    "role_name" VARCHAR(50),

    CONSTRAINT "system_roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "system_settings" (
    "id" SERIAL NOT NULL,
    "close_time" TIME(6),
    "is_sales_open" BIT(1),
    "last_updated" TIMESTAMP(6),
    "open_time" TIME(6),
    "draw_time" TIME(6),
    "is_auto_draw" BIT(1),
    "auto_draw_percent" INTEGER,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "transaction_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "transaction_type" VARCHAR(50),
    "title" VARCHAR(255),
    "amount" DECIMAL(18,2),
    "status" VARCHAR(50),
    "created_at" TIMESTAMP(6),
    "system_bank_id" INTEGER,
    "slip_image" VARCHAR,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "transactions_deposit" (
    "deposit_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "customer_name" VARCHAR(100),
    "bank_name" VARCHAR(100),
    "account_number" VARCHAR(50),
    "amount" DECIMAL(18,2),
    "currency_code" VARCHAR(10),
    "slip_image" VARCHAR NOT NULL,
    "status" VARCHAR(20),
    "deposit_datetime" TIMESTAMP(6) NOT NULL,
    "created_at" TIMESTAMP(6),
    "reviewed_by" VARCHAR(100),
    "reject_reason" VARCHAR(255),
    "reject_reasons" VARCHAR,
    "edit_count" INTEGER,

    CONSTRAINT "transactions_deposit_pkey" PRIMARY KEY ("deposit_id")
);

-- CreateTable
CREATE TABLE "user_referrals" (
    "referral_id" SERIAL NOT NULL,
    "referrer_id" INTEGER NOT NULL,
    "referred_user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6),
    "total_purchase_comm" DECIMAL(18,2),
    "total_win_comm" DECIMAL(18,2),

    CONSTRAINT "user_referrals_pkey" PRIMARY KEY ("referral_id")
);

-- CreateTable
CREATE TABLE "userbanks" (
    "user_bank_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "bank_id" INTEGER NOT NULL,
    "account_name" VARCHAR(100),
    "account_number" VARCHAR(50),
    "is_primary" BIT(1),
    "created_at" TIMESTAMP(6),
    "currency_code" VARCHAR(10),
    "status" VARCHAR(20),
    "passbook_image" TEXT,
    "reject_reason" VARCHAR,

    CONSTRAINT "userbanks_pkey" PRIMARY KEY ("user_bank_id")
);

-- CreateTable
CREATE TABLE "username_lastname" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "firstname" VARCHAR(100),
    "lastname" VARCHAR(100),

    CONSTRAINT "username_lastname_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(50),
    "password_hash" VARCHAR(255),
    "referrer_username" VARCHAR(50),
    "is_active" BIT(1),
    "created_at" TIMESTAMP(6),
    "role_id" INTEGER,
    "level_id" INTEGER,
    "wallet_balance" DECIMAL(18,2),
    "total_orders" INTEGER,
    "country" VARCHAR(50),
    "currency_code" VARCHAR(10),
    "is_suspicious" BIT(1),
    "suspicious_reason" VARCHAR(255),
    "total_purchase_comm" DECIMAL(18,2),
    "total_win_comm" DECIMAL(18,2),
    "total_daily_bonus" DECIMAL(18,2),
    "p2p_cancel_count" INTEGER,
    "is_locked" BIT(1),

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "video_comments" (
    "id" SERIAL NOT NULL,
    "video_id" INTEGER,
    "username" VARCHAR(100) NOT NULL,
    "comment_text" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "video_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_likes" (
    "id" SERIAL NOT NULL,
    "video_id" INTEGER,
    "username" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "video_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_promotions" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "cf_video_id" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "likes_count" INTEGER DEFAULT 0,
    "views_count" INTEGER DEFAULT 0,
    "shares_count" INTEGER DEFAULT 0,
    "comments_count" INTEGER DEFAULT 0,
    "thumbnail_url" TEXT,

    CONSTRAINT "video_promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_shares" (
    "id" SERIAL NOT NULL,
    "video_id" INTEGER,
    "username" VARCHAR(100),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "video_shares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "wallet_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "balance" DECIMAL(18,2),
    "points" INTEGER,
    "last_updated" TIMESTAMP(6),

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("wallet_id")
);

-- CreateTable
CREATE TABLE "yeeki_order_items" (
    "item_id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "lottery_type" VARCHAR(50),
    "selected_number" VARCHAR(10),
    "price" DECIMAL(18,2),
    "status" VARCHAR(50),
    "prize_amount" DECIMAL(18,2),

    CONSTRAINT "yeeki_order_items_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "yeeki_orders" (
    "order_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "round_id" INTEGER NOT NULL,
    "total_amount" DECIMAL(18,2),
    "currency_code" VARCHAR(10),
    "status" VARCHAR(50),
    "order_note" VARCHAR,
    "created_at" TIMESTAMP(6),
    "category" VARCHAR(20),

    CONSTRAINT "yeeki_orders_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "yeeki_prize_rates" (
    "id" SERIAL NOT NULL,
    "lottery_type" VARCHAR(50),
    "multiplier" DECIMAL(18,2),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "yeeki_prize_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "yeeki_rounds" (
    "round_id" SERIAL NOT NULL,
    "draw_date" DATE NOT NULL,
    "round_number" INTEGER NOT NULL,
    "open_time" TIMESTAMP(6) NOT NULL,
    "close_time" TIMESTAMP(6) NOT NULL,
    "result_3_top" VARCHAR(3),
    "result_2_bottom" VARCHAR(2),
    "status" VARCHAR(20),
    "draw_time" TIMESTAMP(6),
    "result_8_super" VARCHAR(8),
    "result_4_top" VARCHAR(4),
    "result_6_top" VARCHAR(6),
    "category" VARCHAR(20),
    "round_name" VARCHAR(255),

    CONSTRAINT "yeeki_rounds_pkey" PRIMARY KEY ("round_id")
);

-- CreateTable
CREATE TABLE "yeeki_settings" (
    "id" SERIAL NOT NULL,
    "is_auto_draw" BIT(1),
    "auto_draw_percent" INTEGER,

    CONSTRAINT "yeeki_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_identities" (
    "global_id" VARCHAR(20) NOT NULL,
    "full_name_local" VARCHAR(255) NOT NULL,
    "full_name_english" VARCHAR(255) NOT NULL,
    "date_of_birth" DATE NOT NULL,
    "citizenship_status" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "core_identities_pkey" PRIMARY KEY ("global_id")
);

-- CreateTable
CREATE TABLE "biometric_data" (
    "id" SERIAL NOT NULL,
    "global_id" VARCHAR(20) NOT NULL,
    "face_vector_hash" TEXT,
    "fingerprint_hash" TEXT,
    "last_login_device" VARCHAR(255),
    "last_login_ip" VARCHAR(45),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "biometric_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demographic_metadata" (
    "id" SERIAL NOT NULL,
    "global_id" VARCHAR(20) NOT NULL,
    "blood_type" VARCHAR(5),
    "medical_alert" TEXT,
    "criminal_flag" BOOLEAN DEFAULT false,
    "religion" VARCHAR(50),
    "gender" VARCHAR(20),

    CONSTRAINT "demographic_metadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "video_likes_video_id_username_key" ON "video_likes"("video_id", "username");

-- CreateIndex
CREATE UNIQUE INDEX "biometric_data_global_id_key" ON "biometric_data"("global_id");

-- CreateIndex
CREATE UNIQUE INDEX "demographic_metadata_global_id_key" ON "demographic_metadata"("global_id");

-- AddForeignKey
ALTER TABLE "video_comments" ADD CONSTRAINT "video_comments_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "video_promotions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "video_likes" ADD CONSTRAINT "video_likes_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "video_promotions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "video_shares" ADD CONSTRAINT "video_shares_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "video_promotions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "biometric_data" ADD CONSTRAINT "biometric_data_global_id_fkey" FOREIGN KEY ("global_id") REFERENCES "core_identities"("global_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demographic_metadata" ADD CONSTRAINT "demographic_metadata_global_id_fkey" FOREIGN KEY ("global_id") REFERENCES "core_identities"("global_id") ON DELETE CASCADE ON UPDATE CASCADE;
