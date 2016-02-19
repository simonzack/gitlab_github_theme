/* globals GM_addStyle, document, unsafeWindow, Node */
import styleCSS from 'gitlab_github_theme/style.sass'
import nodeTemplate from 'gitlab_github_theme/note.jade'

let $ = unsafeWindow.$

function pairsToObj(attrs){
  let res = {}
  for(let attr of attrs)
    res[attr.name] = attr.value
  return res
}

function moveFirstPost(){
  let noteHeader = $('.detail-page-header')
  let noteDesc = $('.detail-page-description').remove()
  let templateVars = {
    'authorLink': noteDesc.find('.author_link').attr('href'),
    'authorAvatar': noteHeader.find('.avatar').attr('src').match(/^.+\/avatar\/[\da-f]+/),
    'authorName': noteHeader.find('.author').text(),
    'authorUsername': '@' + noteHeader.find('.author_link').attr('href').match(/[^/]+$/),
    'noteText': noteDesc.find('.wiki').html(),
  }
  let created = noteHeader.find('.issue_created_ago')
  Object.assign(templateVars, {
    'createdAttrs': pairsToObj(created.get(0).attributes),
    'createdText': created.text(),
  })
  let edited = noteHeader.find('.issue_edited_ago')
  templateVars.edited = edited.length > 0
  if(edited.length > 0){
    Object.assign(templateVars, {
      'editedAttrs': pairsToObj(noteHeader.find('.issue_edited_ago').get(0).attributes),
      'editedText': noteHeader.find('.issue_edited_ago').text(),
    })
  }
  $(nodeTemplate(templateVars)).prependTo('#notes-list')
}

function moveTitle(){
  $('.detail-page-description .title').prependTo('.issue')
}

function moveIssueNum(){
  let issueNum = $('.detail-page-header .identifier').text().match(/\d+/)
  $('.detail-page-header .identifier').remove()
  for(let node of $('.creator').get(0).childNodes){
    if(node.nodeType == Node.TEXT_NODE)
      node.data = node.data.replace('·', '')
  }
  $(`<span class="header-number">#${issueNum}</span>`).appendTo('.issue > .title')
}

function moveRightColumn(){
  $('.issuable-context-form')
    .prepend($('<div class="block"></div>').append($('.awards').parent().remove().find('.awards')))
    .append($('<div class="block"></div>').append($('.participants')))
}

function fixIssue(){
  if(!/issues\/\d+$/.test(document.location.href))
    return
  moveTitle()
  moveFirstPost()
  moveIssueNum()
  moveRightColumn()
}

function main(){
  GM_addStyle(styleCSS.toString())
  // gitlab uses turbolinks for in-place page loads
  document.addEventListener('page:load', fixIssue, false)
  fixIssue()
}

main()
