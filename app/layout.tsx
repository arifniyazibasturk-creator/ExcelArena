import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme/ThemeContext";
import { I18nProvider } from "@/lib/i18n/I18nContext";
import { LearningAreaProvider } from "@/lib/context/LearningAreaContext";

export const metadata: Metadata = {
  title: "Excel Arena — Master Excel Through Practical Challenges",
  description:
    "An interactive Excel learning platform built around challenges, progression, and mastery. Learn -> Practice -> Test -> Solve.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-learning-area="basic-excel">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var area = localStorage.getItem('excel_arena_active_learning_area');
                if (area === 'financial-excel') {
                  document.documentElement.setAttribute('data-learning-area', 'financial-excel');
                } else {
                  document.documentElement.setAttribute('data-learning-area', 'basic-excel');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-background text-foreground antialiased min-h-screen">
        <ThemeProvider>
          <LearningAreaProvider>
            <I18nProvider>{children}</I18nProvider>
          </LearningAreaProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
