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
        Schema::rename('invoice_histories', 'finalized_invoices');
        Schema::rename('invoice_history_details', 'finalized_invoice_details');

        Schema::table('finalized_invoice_details', function (Blueprint $table) {
            $table->renameColumn('invoice_history_id', 'finalized_invoice_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('finalized_invoice_details', function (Blueprint $table) {
            $table->renameColumn('finalized_invoice_id', 'invoice_history_id');
        });

        Schema::rename('finalized_invoices', 'invoice_histories');
        Schema::rename('finalized_invoice_details', 'invoice_history_details');
    }
};
