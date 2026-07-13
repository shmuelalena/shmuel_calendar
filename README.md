# יומן חכם - שמואל 📅
## PWA - Progressive Web App

---

## 📁 מבנה הקבצים
```
shmuel-calendar/
├── index.html      ← האפליקציה הראשית
├── manifest.json   ← הגדרות PWA
├── sw.js           ← Service Worker (עבודה אופליין)
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

---

## 🚀 אפשרויות פריסה (בחר אחת)

### אפשרות 1: GitHub Pages (חינם, מומלץ)
1. פתח חשבון ב-github.com
2. צור repository חדש: `shmuel-calendar`
3. העלה את כל הקבצים
4. Settings → Pages → Source: `main branch`
5. האפליקציה תהיה זמינה ב: `https://yourusername.github.io/shmuel-calendar`

### אפשרות 2: Netlify (חינם, קל מאוד)
1. כנס ל-netlify.com
2. גרור את תיקיית `shmuel-calendar` ישירות לדפדפן
3. קבל URL אוטומטי תוך שניות!

### אפשרות 3: Vercel (חינם)
```bash
npm i -g vercel
cd shmuel-calendar
vercel
```

---

## 📲 התקנה בטלפון

### iPhone (Safari בלבד!):
1. פתח את ה-URL באפליקציית Safari
2. לחץ על כפתור השיתוף ⬆️
3. גלול למטה ← "הוסף למסך הבית"
4. לחץ "הוסף"

### Android (Chrome):
1. פתח את ה-URL ב-Chrome
2. יופיע באנר "הוסף למסך הבית" אוטומטי
3. או: ⋮ ← "התקן אפליקציה"

---

## ✅ רשימת בדיקה לפני הפריסה
- [ ] הקבצים עלו לשרת עם HTTPS
- [ ] manifest.json נטען (בדוק בכלי המפתח)
- [ ] Service Worker רשום בהצלחה
- [ ] האייקון מופיע נכון

---

## 🔑 פיצ'רים
- ✅ עבודה אופליין (Service Worker)
- ✅ זיכרון AI - לומד מהרגלים שלך
- ✅ העלאת תמונת לוח משמרות
- ✅ RTL מלא (עברית)
- ✅ Dark Mode אוטומטי
- ✅ Safe Area (נוצ'/iPhone X+)
- ✅ Shortcuts בטלפון
- ✅ Push Notifications מוכן

---

## 📝 הערות
- האפליקציה שומרת נתונים ב-localStorage של הטלפון
- לסנכרון בין מכשירים יש צורך ב-Google Drive API
- מפתח Anthropic API כבר מוגדר דרך Claude

---

## Netlify Environment Variables (מומלץ)
להפעלה מאובטחת יותר, הגדר מפתח Groq בצד שרת כדי שלא תהיה תלות במפתח מהקליינט.

1. Netlify → Site settings → Environment variables
2. צור משתנים:
    - `GROQ_API_KEY` = המפתח שלך מ-Groq
    - `CORS_ALLOW_ORIGIN` = הדומיין שלך (למשל `https://your-site.netlify.app`)
3. בצע Redeploy לאתר

הערה: אפשר עדיין לשים מפתח ב-UI של האפליקציה, אבל אחרי הגדרת `GROQ_API_KEY` ב-Netlify זה הופך לאופציונלי בלבד.
