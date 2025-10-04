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
        Schema::table('projects', function (Blueprint $table) {
            // 技術スタック
            $table->json('technologies')->nullable()->after('category');

            // 必要スキル
            $table->json('required_skills')->nullable()->after('technologies');

            // 見積もり期間
            $table->string('estimated_duration')->nullable()->after('deadline');

            // 応募数カウンター
            $table->integer('application_count')->default(0)->after('status');

            // ステータスの更新
            $table->enum('status', ['draft', 'open', 'in_progress', 'completed', 'cancelled'])
                ->default('open')->change();

            // インデックス追加
            $table->index('category');
            $table->index('status');
            $table->index('deadline');
            $table->index(['budget_min', 'budget_max']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['technologies', 'required_skills', 'estimated_duration', 'application_count']);

            // インデックス削除
            $table->dropIndex(['category']);
            $table->dropIndex(['status']);
            $table->dropIndex(['deadline']);
            $table->dropIndex(['budget_min', 'budget_max']);
        });
    }
};
