
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeProps {
  value: string;
  size?: number;
}

const QRCode: React.FC<QRCodeProps> = ({ value, size = 256 }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-inner inline-block">
      <QRCodeSVG
        value={value}
        size={size}
        bgColor={"#ffffff"}
        fgColor={"#000000"}
        level={"L"}
        includeMargin={false}
      />
    </div>
  );
};

export default QRCode;
