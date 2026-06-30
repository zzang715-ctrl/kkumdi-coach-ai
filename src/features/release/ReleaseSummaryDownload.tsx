"use client";

type ReleaseSummaryDownloadProps = {
  readyFeatures: string[];
  launchBlockers: {
    title: string;
    description: string;
  }[];
  recommendedOrder: string[];
};

export function ReleaseSummaryDownload({
  readyFeatures,
  launchBlockers,
  recommendedOrder,
}: ReleaseSummaryDownloadProps) {
  function downloadSummary() {
    const content = buildReleaseSummary(readyFeatures, launchBlockers, recommendedOrder);
    const blob = new Blob([`\ufeff${content}`], { type: "text/markdown;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `kkumdi-release-summary-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={downloadSummary}
      className="inline-flex h-11 items-center justify-center rounded-md border border-sky-300 bg-sky-50 px-4 text-sm font-semibold text-sky-900 transition hover:bg-sky-100"
    >
      출시 요약 내보내기
    </button>
  );
}

function buildReleaseSummary(
  readyFeatures: string[],
  launchBlockers: {
    title: string;
    description: string;
  }[],
  recommendedOrder: string[],
) {
  const lines = [
    "# 꿈디코치 AI 강사비서 출시 요약",
    "",
    `- 내보낸 시간: ${new Date().toLocaleString("ko-KR")}`,
    "- 현재 판단: v1.0 기본 버전",
    "",
    "## 준비된 기능",
    "",
    ...readyFeatures.map((feature) => `- ${feature}`),
    "",
    "## 공개 전 남은 일",
    "",
    ...launchBlockers.flatMap((item, index) => [`${index + 1}. ${item.title}`, `   - ${item.description}`]),
    "",
    "## 추천 진행 순서",
    "",
    ...recommendedOrder.map((step, index) => `${index + 1}. ${step}`),
    "",
  ];

  return lines.join("\n");
}
