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
        if (Schema::hasColumn('invoice_histories', 'status')) {
            Schema::table('invoice_histories', function (Blueprint $table) {
                $table->dropColumn('status');
            });
        }

        if (!Schema::hasColumn('invoice_histories', 'document_type')) {
            Schema::table('invoice_histories', function (Blueprint $table) {
                $table->string('document_type')->default('estimate')->after('version'); // 'estimate' or 'invoice'
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invoice_histories', function (Blueprint $table) {
            $table->string('status')->after('version');
            $table->dropColumn('document_type');
        });
    }
};
