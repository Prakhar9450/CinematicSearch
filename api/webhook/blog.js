import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  });
}

const db = getFirestore();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.WEBHOOK_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { event_type, data } = req.body;

  if (event_type === "test") {
    return res.status(200).json({ success: true });
  }

  if (event_type === "publish_articles") {
    try {
      const docRef = db.collection("blogPosts").doc(data.id);
      await docRef.set({
        externalId: data.id,
        title: data.title,
        slug: data.slug,
        contentHtml: data.content_html,
        contentMarkdown: data.content_markdown || "",
        metaDescription: data.meta_description || null,
        imageUrl: data.image_url || null,
        tags: data.tags || [],
        publishedAt: data.created_at
          ? new Date(data.created_at)
          : new Date(),
        createdAt: new Date(),
      });

      return res.status(200).json({
        external_id: data.id,
        external_url: `/blog/${data.slug}`,
      });
    } catch (error) {
      console.error("Error writing blog post:", error);
      return res.status(500).json({ error: "Failed to save blog post" });
    }
  }

  return res.status(400).json({ error: "Unknown event_type" });
}
