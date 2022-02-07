const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#templates-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#templates-author-cloud-link').innerHTML)
};

'use strict';
/* const opts = {
  articleSelector: '.post',
  titleSelector: '.post-title',
  titleListSelector: '.titles',
  articleTagsSelector: '.post-tags .list',
  articleAuthorSelector: '.post-author',
  tagsListSelector: '.tags.list',
  cloudClassCount: 5,
  cloudClassPrefix: 'tag-size-',
  authorsListSelector: '.authors.list'
}; */

const opts = {
  tagSizes: {
    count: 5,
    classPrefix: 'tag-size-',
  },
};

const select = {
  all: {
    articles: '.post',

    linksTo: {
      tags: 'a[href^="#tag-"]',
      authors: 'a[href^="#author-"]'
    },
  },

  article: {
    tags: '.post-tags .list',
    title: '.post-title',
    author: '.post-author'
  },

  listOf: {
    titles: '.titles',
    tags: '.tags.list',
    authors: '.authors.list'
  },
};

function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');
  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');
  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
  /* [IN PROGRESS] add class 'active' to the clicked link */
  clickedElement.classList.add('active');
  console.log('clickedElement (with plus): ' + clickedElement);
  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts .active');
  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  console.log(articleSelector);
  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  console.log(targetArticle);
  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
}

function generateTitleLinks(customSelector = ''){
  /* remove contents of titleList */
  const titleList = document.querySelector(select.listOf.titles);
  function clearMessages(){
    titleList.innerHTML = '';
  }  
  clearMessages();

  /* for each article */
  const articles = document.querySelectorAll(select.all.articles + customSelector);

  let html = '';

  for(let article of articles){
    /* get the article id */
    const articleId = article.getAttribute('id');
    console.log(articleId);
    /* find the title element */
    /* get the title from the title element */
    const articleTitle = article.querySelector(select.article.title).innerHTML;
    console.log(articleTitle);
    /* create HTML of the link */
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    console.log(linkHTML);
    /* insert link into titleList */
    html = html + linkHTML;
  }
  
  titleList.insertAdjacentHTML('beforeend', html);
  
  const links = document.querySelectorAll('.titles a');
  console.log(links);

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}
generateTitleLinks();

function calculateTagsParams(tags){
  const params = {
    max: 0,
    min: 999999
  };
  for (let tag in tags) {
    console.log(tag + ' is used ' + tags[tag] + ' times');
    if (tags[tag] > params.max) {
      params.max = tags[tag];
    } else if (tags[tag] < params.min) {
      params.min = tags[tag];
    }
  }
  return params;
}

function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (opts.tagSizes.count - 1) + 1);
  return opts.tagSizes.classPrefix + classNumber;
}

function generateTags(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(select.all.articles);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find tags wrapper */
    const tagList = article.querySelector(select.article.tags);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    /* START LOOP: for each tag */
    for (let tag of articleTagsArray) {
      /* generate HTML of the link */
      const linkHTMLData = {id: tag, title: tag};
      const linkHTML = templates.tagLink(linkHTMLData);
      /* add generated code to html variable */
      html = html + linkHTML;
      console.log(linkHTML);
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags.hasOwnProperty(tag)) {
        /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagList.insertAdjacentHTML('beforeend', html);
  /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(select.listOf.tags);

  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);
  /* [NEW] create variable for all links HTML code */
  const allTagsData = {tags: []};
  /* [NEW] START LOOP: for each tag in allTags: */
  for (let tag in allTags) {
    /* [NEW] generate code of a link and add it to allTagsHTML */
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  /* [NEW] END LOOP: for each tag in allTags */
  }
  /* [NEW] add html from allTagsHTML to tagList */
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  console.log('D:U:P:A', allTagsData);
}
generateTags();

function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const links = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  for ( let link of links) {
    /* remove class active */
    link.classList.remove('active');
  /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const targetLinks = document.querySelectorAll('a[href="' + href + '"]');
  console.log(targetLinks);
  /* START LOOP: for each found tag link */
  for (let targetLink of targetLinks) {
    /* add class active */
    targetLink.classList.add('active');
  /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const tagsLinks = document.querySelectorAll(select.all.linksTo.tags);
  console.log('!', tagsLinks);
  /* START LOOP: for each link */
  for ( let tagsLink of tagsLinks) {
    /* add tagClickHandler as event listener for that link */
    tagsLink.addEventListener('click', tagClickHandler);
  /* END LOOP: for each link */
  }
}
addClickListenersToTags();

function generateAuthors() {
  let allAuthors = {};
  const articles = document.querySelectorAll(select.all.articles);
  for (let article of articles) {
    const authorWrapper = article.querySelector(select.article.author);
    let html = '';
    const articleAuthor = article.getAttribute('data-author');
    console.log(articleAuthor);
    const linkHTMLData = {id: articleAuthor, title: articleAuthor};
    const linkHTML = templates.authorLink(linkHTMLData);
    html = html + linkHTML;
    
    if(!allAuthors.hasOwnProperty(articleAuthor)) {
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }

    authorWrapper.insertAdjacentHTML('beforeend', html);
  }
  
  const authorList = document.querySelector(select.listOf.authors);
  
  //let allAuthorsHTML = '';
  const allAuthorsData = {authors: []};

  for(let author in allAuthors) {
    
    allAuthorsData.authors.push({
      author: author,
      count: allAuthors[author],
    });
  } 
  authorList.innerHTML = templates.authorCloudLink(allAuthorsData);
  console.log('!', allAuthorsData);
}
generateAuthors();

function authorClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const author = href.replace('#author-', '');
  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  for (let activeAuthorLink of activeAuthorLinks) {
    activeAuthorLink.classList.remove('active');
  }
  const targetLinks = document.querySelectorAll('a[href="' + href + '"]');
  for ( let targetLink of targetLinks) {
    targetLink.classList.add('active');
  }
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors() {
  const authorLinks = document.querySelectorAll(select.all.linksTo.authors);
  for (let authorLink of authorLinks) {
    authorLink.addEventListener('click', authorClickHandler);
  }
}
addClickListenersToAuthors();

