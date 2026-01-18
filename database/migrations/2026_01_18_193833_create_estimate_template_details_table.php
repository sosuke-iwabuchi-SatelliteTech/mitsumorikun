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
        Schema::create('estimate_template_details', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('estimate_template_id')->constrained()->cascadeOnDelete();
            
            $table->string('item_name');
            $table->decimal('quantity', 15, 2)->default(1);
            $table->string('unit')->nullable();
            $table->decimal('unit_price', 15, 2)->default(0);
            $table->string('tax_classification')->default('exclusive');
            $table->decimal('amount', 15, 2)->default(0);
            
            $table->string('group_name')->nullable();
            $table->text('remarks')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('estimate_template_details');
    }
};
