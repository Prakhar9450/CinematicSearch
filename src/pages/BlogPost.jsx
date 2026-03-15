import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { HiChevronLeft } from "react-icons/hi";
import Contextpage from "../Contextpage";

function BlogPost() {
  const { slug } = useParams();
  const { setHeader } = useContext(Contextpage);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setHeader("Blog");
    const fetchPost = async () => {
      try {
        const q = query(
          collection(db, "blogPosts"),
          where("slug", "==", slug),
          limit(1)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          setNotFound(true);
        } else {
          const doc = snapshot.docs[0];
          setPost({ id: doc.id, ...doc.data() });
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
        setNotFound(true);
      }
      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  const splitHtmlAtMidpoint = (html) => {
    const mid = Math.floor(html.length / 2);
    const splitIndex = html.indexOf("</p>", mid);
    if (splitIndex === -1) return [html, ""];
    const cut = splitIndex + "</p>".length;
    return [html.slice(0, cut), html.slice(cut)];
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <span className="loader m-10"></span>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="h-screen w-full flex flex-col justify-center items-center gap-4">
        <h1 className="text-2xl font-bold text-white">Post not found</h1>
        <Link
          to="/blog"
          className="text-blue-400 hover:text-blue-300 transition-colors">
          &larr; Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | CinematicSearch Blog</title>
      </Helmet>

      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto px-4 py-10">
        <Link
          to="/blog"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-8">
          <HiChevronLeft className="text-xl" />
          <span>Back to Blog</span>
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {post.title}
        </h1>

        <div className="flex items-center flex-wrap gap-3 mb-6">
          <span className="text-sm text-gray-400">
            {formatDate(post.publishedAt)}
          </span>
          {(post.tags || []).map((tag) => (
            <span
              key={tag}
              className="bg-blue-600/20 text-blue-300 text-xs rounded-full px-2 py-1">
              {tag}
            </span>
          ))}
        </div>

        {post.featuredImageUrl && (
          <img
            src={post.featuredImageUrl}
            alt={post.title}
            className="w-full rounded-xl mb-8"
          />
        )}

        {post.contentImageUrl ? (
          (() => {
            const [firstHalf, secondHalf] = splitHtmlAtMidpoint(post.contentHtml);
            return (
              <>
                <div className="blog-prose" dangerouslySetInnerHTML={{ __html: firstHalf }} />
                <img
                  src={post.contentImageUrl}
                  alt={post.title}
                  className="w-full rounded-xl my-8"
                />
                <div className="blog-prose" dangerouslySetInnerHTML={{ __html: secondHalf }} />
              </>
            );
          })()
        ) : (
          <div
            className="blog-prose"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        )}
      </motion.article>
    </>
  );
}

export default BlogPost;
