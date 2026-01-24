<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;

final class IndexTest extends TestCase
{
    /**
     * 正常系
     * phpinfo() が実行され、想定された情報が出力されること
     * @group normal
     */
    public function testPhpInfoNormal(): void
    {
        ob_start();
        require __DIR__ . '/../index.php';
        $output = ob_get_clean();

        // 出力が存在する
        $this->assertNotEmpty($output);

        // phpinfo 固有の文字列が含まれる
        $this->assertStringContainsString('PHP Version', $output);
    }

    /**
     * 異常系
     * 出力バッファが無効でも致命的エラーにならないこと
     * （想定外環境でも処理が落ちないことの確認）
     * @group error
     */
    public function testPhpInfoAbnormal(): void
    {
        // 出力バッファを開始しない
        // phpinfo() は標準出力に直接出るが、例外は発生しないはず
        try {
            require __DIR__ . '/../index.php';
            $this->assertTrue(true); // ここまで到達すればOK
        } catch (\Throwable $e) {
            $this->fail('phpinfo() caused an unexpected error: ' . $e->getMessage());
        }
    }
}
