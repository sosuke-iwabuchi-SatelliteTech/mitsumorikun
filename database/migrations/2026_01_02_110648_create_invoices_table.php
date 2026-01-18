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
        Schema::create('invoices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_group_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('customer_id')->constrained()->cascadeOnDelete();

            $table->string('estimate_number'); // 6-digit alphanum, scoped to user_group
            $table->integer('version')->default(1);
            $table->string('status'); // creating, submitted, order_received, invoice_creating, invoice_submitted, payment_confirmed

            $table->string('title');
            $table->date('estimate_date');
            $table->date('delivery_deadline')->nullable();
            $table->string('construction_address')->nullable();
            $table->string('payment_terms')->nullable();
            $table->date('expiration_date')->nullable();
            $table->text('remarks')->nullable();

            $table->decimal('total_amount', 15, 2)->default(0);
            $table->decimal('tax_amount', 15, 2)->default(0);

            // Snapshot fields for historical consistency
            $table->string('issuer_name')->nullable();
            $table->string('issuer_registration_number')->nullable();
            $table->string('issuer_address')->nullable();
            $table->string('issuer_tel')->nullable();
            $table->string('issuer_fax')->nullable();

            $table->string('bank_name')->nullable();
            $table->string('branch_name')->nullable();
            $table->string('account_type')->nullable();
            $table->string('account_number')->nullable();
            $table->string('account_holder')->nullable();

            $table->string('japan_post_bank_symbol')->nullable();
            $table->string('japan_post_bank_number')->nullable();
            $table->string('japan_post_bank_account_holder')->nullable();

            $table->timestamps();

            // Unique constraint for estimate_number and version per user group
            $table->unique(['user_group_id', 'estimate_number', 'version']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
