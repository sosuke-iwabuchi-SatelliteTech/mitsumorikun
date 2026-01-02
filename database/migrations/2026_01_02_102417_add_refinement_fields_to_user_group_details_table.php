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
        Schema::table('user_group_details', function (Blueprint $table) {
            $table->string('invoice_company_name')->nullable()->after('user_group_id');
            $table->boolean('use_bank')->default(false)->after('email');
            $table->boolean('use_japan_post')->default(false)->after('account_holder');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_group_details', function (Blueprint $table) {
            $table->dropColumn(['invoice_company_name', 'use_bank', 'use_japan_post']);
        });
    }
};
