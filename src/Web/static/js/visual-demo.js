// Explicit browser-only smoke test. This module is never loaded by app.js.
import { createResponseBlockState, setResponseBlock, appendResponseText,
         flushResponseBlocks, disposeResponseBlocks } from './rendering.js';

let demo;

export function removeVisualDemo() {
    if (!demo) return;
    disposeResponseBlocks(demo.state);
    demo.element.remove();
    demo = null;
}

export function runVisualDemo() {
    if (new URLSearchParams(window.location.search).get('visualDemo') !== '1') {
        throw new Error('Open GlorpCat with ?visualDemo=1 first.');
    }
    const view = [...document.querySelectorAll('#messages .conversation-view')]
        .find(element => getComputedStyle(element).display !== 'none');
    if (!view) throw new Error('Open a conversation first.');
    removeVisualDemo();
    const element = document.createElement('div');
    element.className = 'message assistant-message';
    const content = document.createElement('div');
    content.className = 'assistant-content';
    element.appendChild(content);
    view.appendChild(element);
    const state = createResponseBlockState(content);
    demo = { state, element };
    setResponseBlock(state, { id: 1, type: 'text', content: 'Before the test visual.\n\n' });
    setResponseBlock(state, { id: 2, type: 'visual', visual_id: 42 });
    setResponseBlock(state, { id: 3, type: 'text', content: 'After the test visual.' });
    flushResponseBlocks(state);
    return {
        // Tick a checkbox before calling these. It should remain ticked.
        repeatVisualSnapshot() {
            setResponseBlock(state, { id: 2, type: 'visual', visual_id: 42 });
            flushResponseBlocks(state);
        },
        appendText() {
            appendResponseText(state, 3, '\n\nMore text after the visual.');
            flushResponseBlocks(state);
        },
        remove: removeVisualDemo,
    };
}
