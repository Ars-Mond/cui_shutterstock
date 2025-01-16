// ==UserScript==
// @name         CUI Shutterstock
// @namespace    http://tampermonkey.net/
// @version      1.8.4
// @description  Custom ui shutterstock
// @author       Ars_Mond
// @match        https://www.shutterstock.com/*
// @grant        none
// ==/UserScript==

window.addEventListener('load', function() {
    (function() {
        'use strict';

        // Add custom styles for am-element class
        const style = document.createElement('style');
        style.textContent = `
            .am-element {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                flex-basis: 50%;
                padding: 10px;
                border: 1px solid rgb(204, 204, 204);
                border-radius: 8px;
            }
        `;
        document.head.appendChild(style);

        // Function to insert custom content without duplication
        function insertCustomContent() {

            if (document.querySelector('.am-main')) return; // Prevent duplication

            const nextDataScript = document.getElementById('__NEXT_DATA__');

            // Find the script tag with id="__NEXT_DATA__" and extract the description
            let description = '';
            let keywords = '';
            if (nextDataScript && nextDataScript.type === 'application/json') {
                try {
                    const jsonData = JSON.parse(nextDataScript.textContent);

                    if (jsonData && jsonData.props && jsonData.props.pageProps && jsonData.props.pageProps.asset && jsonData.props.pageProps.asset.description) {
                        description = jsonData.props.pageProps.asset.description;
                        console.log('Found description:', description);
                    }

                    if (jsonData && jsonData.props && jsonData.props.pageProps && jsonData.props.pageProps.asset && jsonData.props.pageProps.asset.keywords) {
                        keywords = jsonData.props.pageProps.asset.keywords;
                        keywords = keywords.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(', ');
                        console.log('Found keywords:', keywords);
                    }
                } catch (err) {
                    console.error('Ошибка парсинга JSON:', err);
                }
            }

            // Add a new div after the element with class 'mui-1supug5-container-container'
            const container = document.querySelector('.mui-1supug5-container-container');
            if (container) {
                const mainDiv = document.createElement('div');
                mainDiv.style.maxWidth = '1280px';
                mainDiv.style.margin = 'auto';
                mainDiv.style.display = 'flex';
                mainDiv.style.alignItems = 'stretch';
                mainDiv.style.gap = '24px';
                mainDiv.className = 'am-main';

                // description
                const descriptionDiv = document.createElement('div');
                descriptionDiv.className = 'am-element';
                const descriptionLabel = document.createElement('h2');
                descriptionLabel.innerText = 'Description';
                const descParagraph = document.createElement('p');
                descParagraph.innerText = description;

                descriptionDiv.appendChild(descriptionLabel);
                descriptionDiv.appendChild(descParagraph);

                const copyDescButton = document.createElement('button');
                copyDescButton.innerText = 'Скопировать';
                copyDescButton.onclick = function() {
                    navigator.clipboard.writeText(descParagraph.innerText).then(() => {
                        //alert('Описание скопировано!');
                    }).catch(err => {
                        console.error('Ошибка копирования: ', err);
                    });
                };
                descriptionDiv.appendChild(copyDescButton);

                // keywords
                const keywordsDiv = document.createElement('div');
                keywordsDiv.className = 'am-element';
                const keywordsLabel = document.createElement('h2');
                keywordsLabel.innerText = 'Keywords';
                const paragraph = document.createElement('p');
                paragraph.innerText = keywords;

                keywordsDiv.appendChild(keywordsLabel);
                keywordsDiv.appendChild(paragraph);

                const copyButton = document.createElement('button');
                copyButton.innerText = 'Скопировать';
                copyButton.onclick = function() {
                    navigator.clipboard.writeText(paragraph.innerText).then(() => {
                        //alert('Текст скопирован!');
                    }).catch(err => {
                        console.error('Ошибка копирования: ', err);
                    });
                };
                keywordsDiv.appendChild(copyButton);

                mainDiv.appendChild(keywordsDiv);
                mainDiv.appendChild(descriptionDiv);

                container.parentNode.insertBefore(mainDiv, container.nextSibling);
            }
        }

        // Initial content insertion
        insertCustomContent();

        // Observe DOM changes to reinject content
        const observer = new MutationObserver(() => {
            insertCustomContent();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    })();
});
