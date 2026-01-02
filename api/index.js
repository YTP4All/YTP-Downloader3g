// هذا الملف هو المسؤول عن معالجة طلبات التحميل من يوتيوب
module.exports = async (req, res) => {
    // إعدادات السماح بالوصول (CORS) ليعمل الموقع من أي رابط
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // التعامل مع طلبات الاختبار (Preflight)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // معالجة طلب التحميل الفعلي
    if (req.method === 'POST') {
        try {
            const { url } = req.body;

            if (!url) {
                return res.status(400).json({ error: "الرابط مطلوب" });
            }

            // استدعاء محرك Cobalt API العالمي (مجاني وقوي جداً)
            const response = await fetch('https://api.cobalt.tools/api/json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    url: url,
                    vQuality: "1080",
                    vCodec: "h264",
                    aFormat: "mp3",
                    isAudioOnly: false
                })
            });

            const data = await response.json();
            
            // إرسال النتيجة (رابط التحميل) إلى الواجهة (index.html)
            return res.status(200).json(data);
        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({ error: "فشل في معالجة الفيديو" });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
};

