/* globals GM_addStyle, unsafeWindow, Node */
import styleCSS from 'gitlab_github_theme/style.css';
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
  $('.page-title ~ *:not(:last-child)').remove();
}

function moveIssueNum(){
  let issueNum;
  for(let node of $('.page-title').get(0).childNodes){
    if(node.nodeType == Node.TEXT_NODE && node.data.includes('Issue')){
      issueNum = node.data.match(/\d+/);
      node.parentNode.removeChild(node);
    }
  }
  for(let node of $('.creator').get(0).childNodes){
    if(node.nodeType == Node.TEXT_NODE)
      node.data = node.data.replace('·', '');
  }
  $(`<span class="header-number">#${issueNum}</span>`).appendTo('.issue-title');
}

function moveParticipants(){
  $('<div class="prepend-top-20 clearfix"></div>').append($('.participants')).appendTo('.issuable-context-form');
}

function main(){
  GM_addStyle(styleCSS.toString());
  moveFirstPost();
  moveTitle();
  moveIssueNum();
  moveParticipants();
}

main();
