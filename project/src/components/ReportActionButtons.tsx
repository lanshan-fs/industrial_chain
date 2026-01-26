import React, { useState } from "react";
import { Button, Space, message, Modal, Input } from "antd";
import {
  DownloadOutlined,
  ShareAltOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ReportActionButtonsProps {
  /** 目标 DOM 节点的 ID (用于截图生成 PDF) */
  targetId?: string;
  /** 报告标题 (用于生成文件名) */
  reportTitle?: string;
  /** 下载按钮文案 */
  downloadText?: string;
  /** 分享按钮文案 */
  shareText?: string;
  /** 自定义下载逻辑 (如果传入，将覆盖默认的 PDF 下载) */
  onDownload?: () => void;
  /** 自定义分享逻辑 (如果传入，将覆盖默认的复制链接) */
  onShare?: () => void;
  /** 下载开始时的回调 */
  onDownloadStart?: () => void;
}

const ReportActionButtons: React.FC<ReportActionButtonsProps> = ({
  targetId,
  reportTitle = "产业洞察分析报告",
  downloadText = "下载报告",
  shareText = "分享",
  onDownload,
  onShare,
  onDownloadStart,
}) => {
  const [downloading, setDownloading] = useState(false);

  // --- PDF 下载逻辑 ---
  const handleDownloadPdf = async () => {
    // 如果有自定义下载逻辑，优先执行自定义逻辑
    if (onDownload) {
      onDownload();
      return;
    }

    if (!targetId) {
      message.error("未指定导出区域");
      return;
    }

    const element = document.getElementById(targetId);
    if (!element) {
      message.error("找不到导出内容区域");
      return;
    }

    if (onDownloadStart) onDownloadStart();
    setDownloading(true);
    const hide = message.loading("正在生成 PDF 报告，请稍候...", 0);

    try {
      // 1. 将 DOM 转换为 Canvas
      const canvas = await html2canvas(element, {
        scale: 2, // 提高清晰度
        useCORS: true, // 允许跨域图片
        logging: false,
        backgroundColor: "#f0f2f5", // 保持背景色
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      // 2. 计算 PDF 尺寸 (按 A4 纸宽度缩放，高度自适应)
      const contentWidth = canvas.width;
      const contentHeight = canvas.height;

      const pdfWidth = 595.28;
      const pdfHeight = (595.28 / contentWidth) * contentHeight;

      // 3. 生成 PDF
      const pdf = new jsPDF("p", "pt", [pdfWidth, pdfHeight]);
      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

      // 4. 保存文件
      const fileName = `${reportTitle}_${new Date().toISOString().split("T")[0]}.pdf`;
      pdf.save(fileName);

      hide();
      message.success("报告下载成功！");
    } catch (error) {
      hide();
      console.error("PDF Generation Error:", error);
      message.error("报告生成失败，请重试");
    } finally {
      setDownloading(false);
    }
  };

  // --- 分享逻辑 ---
  const handleShare = () => {
    if (onShare) {
      onShare();
      return;
    }

    const url = window.location.href;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(url)
        .then(() => message.success("页面链接已复制"))
        .catch(() => fallbackShare(url));
    } else {
      fallbackShare(url);
    }
  };

  const fallbackShare = (url: string) => {
    Modal.info({
      title: "分享页面",
      content: (
        <div>
          <p style={{ color: "#666", marginBottom: 8 }}>请手动复制下方链接：</p>
          <Input.Group compact>
            <Input
              style={{ width: "calc(100% - 32px)" }}
              defaultValue={url}
              readOnly
              id="share-url-input"
            />
            <Button
              icon={<CopyOutlined />}
              onClick={() => {
                (
                  document.getElementById("share-url-input") as HTMLInputElement
                )?.select();
                document.execCommand("copy");
                message.success("已复制");
              }}
            />
          </Input.Group>
        </div>
      ),
      icon: <ShareAltOutlined style={{ color: "#1890ff" }} />,
      okText: "关闭",
      maskClosable: true,
    });
  };

  return (
    <Space>
      <Button
        icon={<DownloadOutlined />}
        loading={downloading}
        onClick={handleDownloadPdf}
      >
        {downloadText}
      </Button>
      <Button
        type="primary"
        ghost
        icon={<ShareAltOutlined />}
        onClick={handleShare}
      >
        {shareText}
      </Button>
    </Space>
  );
};

export default ReportActionButtons;
