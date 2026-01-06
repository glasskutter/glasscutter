/// <reference types="vite/client" />

interface Window {
  jspdf: {
    jsPDF: new (orientation?: string, unit?: string, format?: string) => {
      internal: { pageSize: { getWidth(): number; getHeight(): number } };
      setDrawColor(r: number, g?: number, b?: number): void;
      setFillColor(r: number, g?: number, b?: number): void;
      setLineWidth(width: number): void;
      setFontSize(size: number): void;
      setFont(name: string, style?: string): void;
      setTextColor(r: number, g?: number, b?: number): void;
      rect(x: number, y: number, w: number, h: number, style?: string): void;
      circle(x: number, y: number, r: number, style?: string): void;
      line(x1: number, y1: number, x2: number, y2: number): void;
      triangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, style?: string): void;
      text(text: string, x: number, y: number, options?: { align?: string; angle?: number }): void;
      addPage(): void;
      save(filename: string): void;
    };
  };
}
