/* globals GM_addStyle */
import style from 'gitlab_github_theme/style.css';

function main(){
    GM_addStyle(style.toString());
}

main();
