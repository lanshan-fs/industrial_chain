import React from "react";
import { Button } from "antd";
import { RightOutlined } from "@ant-design/icons";

interface MoreButtonProps {
  onClick?: () => void;
}

const MoreButton: React.FC<MoreButtonProps> = ({ onClick }) => (
  <Button type="link" size="small" onClick={onClick} style={{ padding: 0 }}>
    更多 <RightOutlined style={{ fontSize: 10 }} />
  </Button>
);

export default MoreButton;
