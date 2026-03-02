import Topic from "@/lib/models/Topic";
import dbConnect from "@/lib/db";

const CURRICULUM = [
  { week: 1, title: "Linear Regression", tag: "Fundamentals" },
  { week: 1, title: "Gradient Descent", tag: "Optimization" },
  { week: 2, title: "Loss Functions", tag: "Fundamentals" },
  { week: 2, title: "Logistic Regression", tag: "Classification" },
  { week: 3, title: "Regularization", tag: "Optimization" },
  { week: 3, title: "Neural Networks Introduction", tag: "Deep Learning" },
  { week: 4, title: "Backpropagation", tag: "Deep Learning" },
  { week: 4, title: "Activation Functions", tag: "Deep Learning" },
  {
    week: 5,
    title: "Convolutional Neural Networks (CNNs)",
    tag: "Computer Vision",
  },
  { week: 5, title: "RNNs & LSTMs", tag: "Sequence Models" },
  { week: 6, title: "Attention Mechanism", tag: "NLP" },
  { week: 6, title: "Transformers Architecture", tag: "NLP" },
  { week: 7, title: "Decision Trees", tag: "Classical ML" },
  { week: 7, title: "Random Forests", tag: "Ensemble" },
  { week: 8, title: "Support Vector Machines (SVMs)", tag: "Classical ML" },
  { week: 8, title: "Clustering (K-Means)", tag: "Unsupervised" },
  {
    week: 9,
    title: "Principal Component Analysis (PCA)",
    tag: "Dimension Reduction",
  },
  { week: 9, title: "BERT Concept & Architecture", tag: "NLP" },
  { week: 10, title: "GPT Concepts & Pre-training", tag: "NLP" },
  { week: 10, title: "Evaluation Metrics", tag: "Validation" },
  { week: 11, title: "Bias-Variance Tradeoff", tag: "Validation" },
  { week: 11, title: "Hyperparameter Tuning", tag: "Optimization" },
  { week: 12, title: "Final Project Phase 1", tag: "Project" },
  { week: 12, title: "Final Project Phase 2", tag: "Project" },
];

export async function seedTopics(clerkId: string) {
  await dbConnect();
  const existing = await Topic.countDocuments({ clerkId });
  if (existing > 0) return;

  const topicsToInsert = CURRICULUM.map((topic) => ({
    ...topic,
    clerkId,
    completed: false,
  }));

  await Topic.insertMany(topicsToInsert);
}
