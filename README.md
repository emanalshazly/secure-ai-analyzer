# SecureAI Analyzer 🛡️

[English](#english) | [العربية](#arabic)

## English

### Overview
SecureAI Analyzer is a web application that helps analyze the security aspects of AI systems. It provides a quick and detailed analysis of potential security risks and recommendations.

### Features
- Quick and detailed security analysis
- Risk categorization (High, Medium, Low)
- Security recommendations
- Clean and responsive user interface

### Technical Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- API Routes

### Project Structure
```
secure-ai-analyzer-new/
├── src/
│   ├── app/
│   │   ├── page.tsx            # Main page
│   │   ├── layout.tsx          # App layout
│   │   └── api/
│   │       └── analyze/
│   │           └── route.ts    # Analysis API
│   └── components/
│       └── ui/
│           ├── SecurityAnalysisForm.tsx
│           └── AnalysisResults.tsx
```

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

### Lessons Learned
- Working with Next.js App Router
- Implementing API routes
- TypeScript type safety
- Component organization
- Error handling
- UI/UX considerations

---

## Arabic <a name="arabic"></a>

### نظرة عامة
SecureAI Analyzer هو تطبيق ويب يساعد في تحليل الجوانب الأمنية لأنظمة الذكاء الاصطناعي. يوفر تحليلاً سريعاً ومفصلاً للمخاطر الأمنية المحتملة والتوصيات.

### المميزات
- تحليل أمني سريع ومفصل
- تصنيف المخاطر (عالية، متوسطة، منخفضة)
- توصيات أمنية
- واجهة مستخدم نظيفة ومتجاوبة

### التقنيات المستخدمة
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- API Routes

### هيكل المشروع
```
secure-ai-analyzer-new/
├── src/
│   ├── app/
│   │   ├── page.tsx            # الصفحة الرئيسية
│   │   ├── layout.tsx          # هيكل التطبيق
│   │   └── api/
│   │       └── analyze/
│   │           └── route.ts    # واجهة برمجة التحليل
│   └── components/
│       └── ui/
│           ├── SecurityAnalysisForm.tsx
│           └── AnalysisResults.tsx
```

### التثبيت
1. استنساخ المستودع
2. تثبيت التبعيات:
   ```bash
   npm install
   ```
3. تشغيل خادم التطوير:
   ```bash
   npm run dev
   ```

### الدروس المستفادة
- العمل مع Next.js App Router
- تنفيذ مسارات API
- السلامة النوعية مع TypeScript
- تنظيم المكونات
- معالجة الأخطاء
- اعتبارات واجهة المستخدم
