declare module 'html2pdf.js' {
  interface Options {
    margin?: number | [number, number, number, number];
    filename?: string;
    image?: { type?: string; quality?: number };
    html2canvas?: any;
    jsPDF?: any;
  }

  interface Html2PdfInstance {
    from(element: HTMLElement): Html2PdfInstance;
    set(options: Options): Html2PdfInstance;
    save(): Promise<void>;
  }

  function html2pdf(): Html2PdfInstance;
  export = html2pdf;
}
