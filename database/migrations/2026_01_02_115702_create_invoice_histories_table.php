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
        Schema::create('invoice_histories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('invoice_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('user_group_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('customer_id')->constrained()->cascadeOnDelete();
            
            $table->string('estimate_number');
            $table->integer('version');
            $table->string('status'); 
            
            $table->string('title');
            $table->date('estimate_date');
            $table->date('delivery_deadline')->nullable();
            $table->string('construction_address')->nullable();
            $table->string('payment_terms')->nullable();
            $table->date('expiration_date')->nullable();
            $table->text('remarks')->nullable();
            
            $table->decimal('total_amount', 15, 2)->default(0);
            $table->decimal('tax_amount', 15, 2)->default(0);

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
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice_histories');
    }
};
