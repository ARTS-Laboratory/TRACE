// Per-visual ordered writes survive React unmounts and conversation switching.
// A page reload reads durable state from the API. No localStorage is used.
export function createVisualStateStore(fetcher = (...args) => fetch(...args)) {
    const records = new Map();

    function snapshot(state) {
        if (!state || typeof state !== 'object' || Array.isArray(state)
            || Object.keys(state).some(key => key !== 'checked')) {
            throw new Error('Invalid checklist state');
        }
        const checked = Object.hasOwn(state, 'checked') ? state.checked : {};
        if (!checked || typeof checked !== 'object' || Array.isArray(checked)
            || Object.keys(checked).some(id => !id.length)
            || Object.values(checked).some(value => typeof value !== 'boolean')) {
            throw new Error('Invalid checklist state');
        }
        return { checked: Object.fromEntries(Object.keys(checked).sort().map(id => [id, checked[id]])) };
    }
    const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);

    function publish(record) {
        for (const listener of record.listeners) {
            try { listener({ phase: record.phase }); }
            catch (error) { console.error('Visual save status listener failed:', error); }
        }
    }

    async function drain(id, record) {
        if (record.running) return;
        record.running = true;
        record.phase = 'saving';
        publish(record);
        try {
            while (!same(record.acknowledged, record.desired)) {
                const outgoing = snapshot(record.desired);
                const response = await fetcher(`/api/visuals/${encodeURIComponent(id)}/state`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(outgoing),
                    keepalive: true,
                });
                if (!response.ok) throw new Error(`Visual state save failed: ${response.status}`);
                const result = await response.json();
                if (String(result.visual_id) !== id || !same(snapshot(result.state), outgoing)) {
                    throw new Error('Visual state save returned an unexpected response');
                }
                record.acknowledged = outgoing;
            }
            record.phase = 'saved';
        } catch (error) {
            // The server may have committed even if its response was lost.
            // Force a complete PUT on retry instead of trusting the old ack.
            record.acknowledged = null;
            record.phase = 'error';
            console.error('Could not save visual selections:', error);
        } finally {
            record.running = false;
            publish(record);
        }
    }

    return {
        connect(visualId, serverState, listener = () => {}) {
            const id = String(visualId);
            if (!/^[1-9]\d*$/.test(id)) throw new Error('Invalid visual ID');
            let record = records.get(id);
            if (!record) {
                const initial = snapshot(serverState);
                record = { acknowledged: initial, desired: initial, running: false, phase: 'idle', listeners: new Set(), touched: false };
                records.set(id, record);
            } else if (!record.touched) {
                // Untouched visuals may use a newer GET response on remount.
                record.desired = record.acknowledged = snapshot(serverState);
            }
            record.listeners.add(listener);
            listener({ phase: record.phase });
            return {
                state: snapshot(record.desired),
                save(state) {
                    const next = snapshot(state);
                    if (same(next, record.desired) && record.phase !== 'error') return;
                    record.desired = next;
                    record.touched = true;
                    void drain(id, record);
                },
                retry() { if (record.phase === 'error') void drain(id, record); },
                disconnect() { record.listeners.delete(listener); },
            };
        },
    };
}
