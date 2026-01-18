<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_group_details', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_group_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('invoice_company_name')->nullable();

            // 基本情報
            $table->string('invoice_registration_number')->nullable();
            $table->string('zip_code')->nullable();
            $table->string('address1')->nullable();
            $table->string('address2')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('fax_number')->nullable();
            $table->string('email')->nullable();

            // 口座情報
            $table->string('account_method')->nullable();
            $table->boolean('use_bank')->default(false);
            $table->string('bank_name')->nullable();
            $table->string('branch_name')->nullable();
            $table->string('account_type')->nullable();
            $table->string('account_number')->nullable();
            $table->string('account_holder')->nullable();

            // ゆうちょ
            $table->boolean('use_japan_post')->default(false);
            $table->string('japan_post_bank_symbol')->nullable();
            $table->string('japan_post_bank_number')->nullable();
            $table->string('japan_post_bank_account_holder')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_group_details');
    }
};
