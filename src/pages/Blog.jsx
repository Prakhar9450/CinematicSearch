import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
} from "firebase/firestore";
import { db } from "../../firebase";
import Contextpage from "../Contextpage";

function Blog() {
  const { setHeader } = useContext(Contextpage);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [pageStack, setPageStack] = useState([]);

  const PAGE_SIZE = 9;

  const fetchPosts = async (afterDoc = null) => {
    setLoading(true);
    try {
      let q;
      if (afterDoc) {
        q = query(
          collection(db, "blogPosts"),
          orderBy("publishedAt", "desc"),
          startAfter(afterDoc),
          limit(PAGE_SIZE + 1)
        );
      } else {
        q = query(
          collection(db, "blogPosts"),
          orderBy("publishedAt", "desc"),
          limit(PAGE_SIZE + 1)
        );
      }

      const snapshot = await getDocs(q);
      const docs = snapshot.docs;

      if (docs.length > PAGE_SIZE) {
        setHasMore(true);
        setPosts(docs.slice(0, PAGE_SIZE).map(docToPost));
        setLastDoc(docs[PAGE_SIZE - 1]);
      } else {
        setHasMore(false);
        setPosts(docs.map(docToPost));
        setLastDoc(docs.length > 0 ? docs[docs.length - 1] : null);
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    }
    setLoading(false);
  };

  const docToPost = (doc) => ({ id: doc.id, ...doc.data() });

  useEffect(() => {
    setHeader("Blog");
    fetchPosts();
  }, []);

  const handleNext = () => {
    if (lastDoc) {
      setPageStack((prev) => [...prev, posts]);
      fetchPosts(lastDoc);
    }
  };

  const handlePrev = () => {
    if (pageStack.length > 0) {
      const prevPosts = pageStack[pageStack.length - 1];
      setPageStack((prev) => prev.slice(0, -1));
      setPosts(prevPosts);
      setHasMore(true);
    }
  };

  const titleToHue = (title) => {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % 360;
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

  return (
    <>
      <Helmet>
        <title>CinematicSearch | Blog</title>
      </Helmet>

      <div className="w-full min-h-screen px-4 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Blog</h1>
          <p className="text-gray-400 mt-2">Latest articles & insights</p>
        </div>

        {loading ? (
          <div className="h-96 w-full flex justify-center items-center">
            <span className="loader m-10"></span>
          </div>
        ) : posts.length === 0 ? (
          <div className="h-96 w-full flex justify-center items-center">
            <p className="text-gray-400 text-lg">
              No articles yet. Check back soon!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}>
                  <Link to={`/blog/${post.slug}`}>
                    <div className="bg-[#161d2f] rounded-xl border border-gray-800 overflow-hidden hover:scale-[1.02] hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                      {post.featuredImageUrl ? (
                        <img
                          src={post.featuredImageUrl}
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-48"
                          style={{
                            background: `linear-gradient(135deg, hsl(${titleToHue(post.title)}, 60%, 30%), hsl(${(titleToHue(post.title) + 60) % 360}, 60%, 20%))`,
                          }}
                        />
                      )}

                      <div className="p-4 flex flex-col flex-1">
                        <h2 className="text-lg font-semibold text-white line-clamp-2">
                          {post.title}
                        </h2>

                        {post.metaDescription && (
                          <p className="text-sm text-gray-400 line-clamp-3 mt-2">
                            {post.metaDescription}
                          </p>
                        )}

                        <div className="mt-auto pt-4 flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {(post.tags || []).slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="bg-blue-600/20 text-blue-300 text-xs rounded-full px-2 py-1">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                            {formatDate(post.publishedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {(pageStack.length > 0 || hasMore) && (
              <div className="flex justify-center gap-4 mt-8">
                {pageStack.length > 0 && (
                  <button
                    onClick={handlePrev}
                    className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                    Previous
                  </button>
                )}
                {hasMore && (
                  <button
                    onClick={handleNext}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors">
                    Next
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Blog;
