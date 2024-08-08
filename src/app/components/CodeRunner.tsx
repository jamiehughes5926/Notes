import React, { useEffect, useRef } from "react";

interface CodeRunnerProps {
  html: string;
  css: string;
  js: string;
}

const CodeRunner: React.FC<CodeRunnerProps> = ({ html, css, js }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const doc =
        iframeRef.current.contentDocument ||
        iframeRef.current.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <style>${css}</style>
            </head>
            <body>
              ${html}
              <script>${js}<\/script>
            </body>
          </html>
        `);
        doc.close();
      }
    }
  }, [html, css, js]);

  return <iframe ref={iframeRef} style={{ width: "100%", height: "100%" }} />;
};

export default CodeRunner;
