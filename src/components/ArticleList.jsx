import React from 'react';

const articles = [
  {
    title: "Don't Stop Pruning Your Plants This Winter—10 Types That Still Need Your Attention",
    url: "https://www.thespruce.com/plants-you-can-prune-in-winter-8741074",
  },
  {
    title: "6 Things That Immediately Make Your Garden Look Bad, According to Gardeners",
    url: "https://www.thespruce.com/things-that-immediately-make-your-garden-bad-8737083",
  },
  {
    title: "10 Gardening Tasks You Should Never Do When the Ground Is Frozen",
    url: "https://www.bhg.com/garden-tasks-to-stop-doing-after-ground-freezes-8743439",
  },
  {
    title: "5 Things That Are Making Your Fall Containers Look Bad, According to Gardeners",
    url: "https://www.thespruce.com/things-making-your-fall-containers-look-bad-8739132",
  },
  {
    title: "The One Important Step You Should Never Skip When Potting Plants",
    url: "https://www.southernliving.com/use-fresh-soil-when-potting-plants-8684738",
  },
];

const ArticleList = () => {
  return (
    <div className="mt-8 mb-8">
      <h2 className="font-semibold text-[24px] text-[#444444] mb-4">
        Recommended Articles on Plant Health and Best Practices
      </h2>
      <ul className="list-none p-0">
        {articles.map((article, index) => (
          <li key={index} className="mb-4">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-lg hover:underline"
            >
              {article.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArticleList;
