/* globals GM_addStyle, document, unsafeWindow, Node */
import styleCSS from 'gitlab_github_theme/style.sass';
import nodeTemplate from 'gitlab_github_theme/note.jade';

let $ = unsafeWindow.$;

function pairsToObj(attrs){
  let res = {};
  for(let attr of attrs)
    res[attr.name] = attr.value;
  return res;
}

function moveFirstPost(){
  let issueDetails = $('.issue-details');
  $(nodeTemplate({
    'authorLink': issueDetails.find('.author_link').attr('href'),
    'authorAvatar': issueDetails.find('.avatar').attr('src').match(/^.+\/avatar\/[\da-f]+/),
    'authorName': issueDetails.find('.author').text(),
    'authorUsername': '@' + issueDetails.find('.author_link').attr('href').match(/[^/]+$/),
    'noteText': issueDetails.find('.wiki').html(),
    'createdAttrs': pairsToObj(issueDetails.find('.issue_created_ago').get(0).attributes),
    'createdText': issueDetails.find('.issue_created_ago').text(),
    'editedAttrs': pairsToObj(issueDetails.find('.issue_edited_ago').get(0).attributes),
    'editedText': issueDetails.find('.issue_edited_ago').text(),
  })).prependTo('#notes-list');
}

function moveTitle(){
  $('.issue-title').prependTo('.page-title');
  $('.page-title + *').remove();
}

function moveIssueNum(){
  let issueNum = $('.issue-id').text().match(/\d+/);
  $('.issue-id').remove();
  for(let node of $('.creator').get(0).childNodes){
    if(node.nodeType == Node.TEXT_NODE)
      node.data = node.data.replace('·', '');
  }
  $(`<span class="header-number">#${issueNum}</span>`).appendTo('.issue-title');
}

function moveRightColumn(){
  $('.issuable-context-form')
    .prepend($('<div class="prepend-top-20 clearfix"></div>').append($('span[title="Cross-project reference"]')))
    .append($('<div class="prepend-top-20 clearfix"></div>').append($('.participants')));
}

function main(){
  GM_addStyle(styleCSS.toString());
  if(/issues\/\d+$/.test(document.location.href)){
    moveFirstPost();
    moveTitle();
    moveIssueNum();
    moveRightColumn();
  }
}

main();
