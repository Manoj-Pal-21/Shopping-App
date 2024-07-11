import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { itemsActions } from '../store/itemsSlice';
import { fetchActions } from '../store/fetchStatusSlice';

const FetchItems = () => {
    const fetchStatus = useSelector(state => state.fetchStatus);
    const dispatch = useDispatch();

    useEffect(() => {
        if (fetchStatus.fetchDone) return;

        const controller = new AbortController();
        const signal = controller.signal;

        dispatch(fetchActions.markFetchingStarted());
        fetch('http://localhost:8000/items', { signal })
            .then((res) => res.json())
            .then(({ items }) => {
                dispatch(fetchActions.markFetchDone());
                dispatch(fetchActions.markFetchingFinished());
                dispatch(itemsActions.addInitialItems(items));
            })
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    console.error('Fetch error:', error);
                }
            });

        return () => {
            controller.abort();
        };
    }, [dispatch, fetchStatus]);

    return (
        <>     
        </>
    )
}

export default FetchItems