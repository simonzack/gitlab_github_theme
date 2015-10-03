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
  let templateVars = {
    'authorLink': issueDetails.find('.author_link').attr('href'),
    'authorAvatar': issueDetails.find('.avatar').attr('src').match(/^.+\/avatar\/[\da-f]+/),
    'authorName': issueDetails.find('.author').text(),
    'authorUsername': '@' + issueDetails.find('.author_link').attr('href').match(/[^/]+$/),
    'noteText': issueDetails.find('.wiki').html(),
  };
  let created = issueDetails.find('.issue_created_ago');
  Object.assign(templateVars, {
    'createdAttrs': pairsToObj(created.get(0).attributes),
    'createdText': created.text(),
  });
  let edited = issueDetails.find('.issue_edited_ago');
  templateVars.edited = edited.length > 0;
  if(edited.length > 0){
    Object.assign(templateVars, {
      'editedAttrs': pairsToObj(issueDetails.find('.issue_edited_ago').get(0).attributes),
      'editedText': issueDetails.find('.issue_edited_ago').text(),
    });
  }
  $(nodeTemplate(templateVars)).prependTo('#notes-list');
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

function fixIssue(){
  moveFirstPost();
  moveTitle();
  moveIssueNum();
  moveRightColumn();
}

function main(){
  GM_addStyle(styleCSS.toString());
  // gitlab uses turbolinks for in-place page loads
  document.addEventListener('page:load', fixIssue, false);
  if(/issues\/\d+$/.test(document.location.href))
    fixIssue();
}

main();
