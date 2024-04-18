import React, { useState, useEffect, useMemo, useContext, Suspense } from 'react';
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";

//import { DragOutlined, CheckOutlined } from '@ant-design/icons';
import { FloatButton, ConfigProvider, Button } from 'antd';

import { LocationScreenBlock, MetaFloatBtns, Location, IconFloatBtnsKind, ScreenBlock as ScreenBlockType, KeysLocalStorage } from '../types';
import { storeContext } from '../store';
import localStorage from '../localStorage';
import { theme } from './configProvider';
import ws from '../services/webSocket';

import ScreenBlock from '../components/ScreenBlock';
//import UploadBtn from '../components/UploadBtn';
import Menu from '../components/Menu';
import Select from '../components/Select';
//import Chart from '../components/Chart';
import DrawerContainer from '../components/DrawerContainer';


const CreatingScreenPage = React.lazy(() => import('./CreatingScreenPage'));
const CreatingCollectionPage = React.lazy(() => import('./CreatingCollectionPage'));
const ChangeCollectionPage = React.lazy(() => import('./ChangeCollectionPage'));
const ChangeScreenPage = React.lazy(() => import('./ChangeScreenPage'));

type Elem = {
    id: string;
    differenceY: number;
}

enum DrawerMode {
    CreateCollection = 'createCollection',
    CreateScreen = 'createScreen',
    EditScreen = 'editScreen',
    EditCollection = 'editCollection'
}

function Index(): JSX.Element {
    const [isResize, setIsResize] = useState<boolean>(false);
    const [startMove, setStartMove] = useState<boolean>(false);
    const [endMove, setEndMove] = useState<boolean>(true);
    const [locations, setLocations] = useState<LocationScreenBlock>({} as LocationScreenBlock);

    const [currentBlockId, setCurrentBlockId] = useState<string>('');
    const [currentCollectionId, setCurrentCollectionId] = useState<string>('');
    const [currentScreenIds, setCurrentScreenIds] = useState<string[]>([]);
    const [currentIdScreen, setCurrentIdScreen] = useState<string>('');

    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [currentDrawerMode, setCurrentDrawerMode] = useState<DrawerMode | ''>('');

    const store = useContext(storeContext);
    const { screens, collections, copiedScreenIds, copiedScreens } = store;

    const isCopied = copiedScreenIds[currentCollectionId] || {};

    useEffect(() => {
        async function inner() {
            const result = await localStorage.get(KeysLocalStorage.CurrentCollection) as string;

            setCurrentCollectionId(result || collections[0]?.id || '');
        }

        inner();

        ws((screen: ScreenBlockType) => store.updateChartData(screen));

        //console.log(toJS(store.roughScreens));

    
        /*ws.send(JSON.stringify({
            message: 'test value'
        }));*/
    }, []);

    useEffect(() => {
        if (collections.length === 0) {
           // localStorage.setCurrentCollection('');
           // setCurrentCollectionId(collections[0]?.id);
            //localStorage.setCurrentCollection(collections[0]?.id);
        } else if (collections.length === 1) {
            setCurrentCollectionId(collections[0]?.id);
            localStorage.setCurrentCollection(collections[0]?.id);
        }
    }, [store.collections.length]);

    useEffect(() => {
        if (currentCollectionId) {
            const screenIds = collections.find(collection => collection.id === currentCollectionId)?.screenIds;

            if (screenIds) setCurrentScreenIds(screenIds);
        }
    }, [store.collections, currentCollectionId]);

    const createBottomLine = (lowestelem: Elem, elem: HTMLElement, currentBlockId: string) => {
        const div = document.createElement('div');
        const leftScreen = document.getElementById(currentBlockId)?.getBoundingClientRect().left || 0;
        const leftElem = elem.getBoundingClientRect().left;
        const rightElem = elem.getBoundingClientRect().right;

        div.id = `line-${lowestelem.id}`;

        div.style.position = 'absolute';
        div.style.top = elem.getBoundingClientRect().bottom + 2 + 'px';
        div.style.width = elem.offsetWidth + 30 + 'px';
        div.style.zIndex = elem.style.zIndex;
        div.className = 'line';

        if (leftScreen > leftElem) {
            div.style.left = leftElem + 'px';
            div.style.right = rightElem + 30 + 'px';
        } else {
            div.style.left = leftElem - 30 + 'px';
            div.style.right = rightElem + 'px';
        }

        document.body.appendChild(div);
    }

    const removeLine = useMemo(() => {
        const collection = document.querySelectorAll('[id^="line-"]');

        if (collection) {
            for (let line of collection) line?.parentNode?.removeChild(line);
        }
    }, [startMove, endMove, locations]);

    const checkEquality = useMemo(() => {
        const step = 30;

        const currentBottomScreen = locations[currentBlockId]?.bottom;
        const range = [currentBottomScreen - step || 0, currentBottomScreen + step || 0];

        if (locations) {
            let closeElems: Array<Elem> = [];

            const div = document.getElementById(`line-${currentBlockId}`);
            div?.parentNode?.removeChild(div);

            for (let i in locations) {
                if (i !== currentBlockId) {
                    const anotherBottomScreen = locations[i].bottom;

                    const line = document.getElementById(`line-${i}`);
                    line?.parentNode?.removeChild(line);

                    const screen = document.getElementById(i);

                    if (screen) screen!.style.zIndex = '1';

                    if (anotherBottomScreen > range[0] && anotherBottomScreen < range[1] && anotherBottomScreen !== 0) {
                        closeElems.push({
                            id: i,
                            differenceY: Math.abs(currentBottomScreen - anotherBottomScreen),
                        });
                    }
                }
            }

            if (closeElems.length > 0) {
                let lowestelem = {} as Elem;

                for (let i = 0; i < closeElems.length; i++) {
                    if (lowestelem.differenceY && lowestelem.differenceY > closeElems[i].differenceY) {
                        lowestelem = closeElems[i];
                    } else if (!lowestelem.differenceY) {
                        lowestelem = closeElems[i];
                    }
                }

                if (lowestelem) {
                    const elem = document.getElementById(lowestelem.id);

                    if (elem) createBottomLine(lowestelem, elem, currentBlockId);
                }
            }
        }
    }, [locations, currentBlockId]);

    const collectionsForSelect = useMemo(() => {
        return collections.map((collection) => ({
            value: collection.id,
            label: collection.name
        }))
    }, [store.collections.length]);

    const renderSelect = (): React.ReactElement => {
        return <Select
            options={collectionsForSelect}
            handleChange={(value: string) => {
                setCurrentCollectionId(value);
                localStorage.setCurrentCollection(value);
            }}
            placeholder='Select a collection'
            currentValue={currentCollectionId ?? collectionsForSelect[0].value}
        />
    }

    const renderDrawer = (type: DrawerMode | '') => {
        switch (type) {
            case DrawerMode.CreateCollection:
                return <Suspense fallback={<div>...loading</div>}><CreatingCollectionPage
                    closeDrawer={() => setOpenDrawer(false)}
                /></Suspense>;

            case DrawerMode.CreateScreen:
                return <Suspense fallback={<div>...loading</div>}><CreatingScreenPage
                    collectionId={currentCollectionId}
                    closeDrawer={() => setOpenDrawer(false)}
                /></Suspense>;

            case DrawerMode.EditScreen:
                return <Suspense fallback={<div>...loading</div>}><ChangeScreenPage
                    closeDrawer={() => setOpenDrawer(false)}
                    screenId={currentIdScreen}
                /></Suspense>;

            case DrawerMode.EditCollection:
                return <Suspense fallback={<div>...loading</div>}><ChangeCollectionPage
                    closeDrawer={() => setOpenDrawer(false)}
                    collectionId={currentCollectionId}
                /></Suspense>;

            default:
                return <></>;
        }
    }

    const getTitleDrawer = (type: DrawerMode | '') => {
        switch (type) {
            case DrawerMode.CreateCollection:
                return 'Create new collection';

            case DrawerMode.CreateScreen:
                return 'Create new screen';

            case DrawerMode.EditScreen:
                return 'Change the screen';

            case DrawerMode.EditCollection:
                return 'Change the collection';

            default:
                return '';
        }
    }

    const metaBtns: MetaFloatBtns[] = [
        {
            icon: IconFloatBtnsKind.CreateCollection,
            onClick: () => {
                setCurrentDrawerMode(DrawerMode.CreateCollection);
                setOpenDrawer(true);
            },
            tooltip: 'Create a new collection'
        },
        {
            icon: IconFloatBtnsKind.Edit,
            onClick: () => {
                setCurrentDrawerMode(DrawerMode.EditCollection);
                setOpenDrawer(true);
            },
            tooltip: 'Edit the collection',
            hidden: collections.length === 0
        },
        {
            icon: IconFloatBtnsKind.Remove,
            onClick: () => {
                store.removeCollection(currentCollectionId);
                setCurrentCollectionId(collections[0]?.id);
                localStorage.setCurrentCollection(collections[0]?.id || '');
                
                //console.log(collections[0]?.id, '  +++id')
                //await setCurrentCollectionId( collections[0].id ?? '' );
                //localStorage.setCurrentCollection(collections[0].id ?? '');
            },
            tooltip: 'Delete the collection',
            hidden: collections.length === 0,
            popconfirm: 'Are you sure to delete this?'
        },
        {
            icon: IconFloatBtnsKind.CreateScreen,
            onClick: () => {
                setCurrentDrawerMode(DrawerMode.CreateScreen);
                setOpenDrawer(true);
            },
            tooltip: 'Create a new screen',
            hidden: collections.length === 0
        },
    ]

    const onCopy = (screen: ScreenBlockType<LocationScreenBlock | Location>) => {
        if (!isCopied[screen.id]) {
            console.log('no')
            store.setCopiedScreens(
                currentCollectionId,
                screen.id,
                screen.path,
                screen.name,
                screen.updTime,
                screen.initPositions as LocationScreenBlock,
            );
            //store.setCopiedScreenIds( currentCollectionId, screen.id );
        } else { //console.log('yes')
            store.removeCopiedScreen(currentCollectionId, screen.id);
        }
    }

    const isLengthCopiedScreens = Object.keys(copiedScreens).length > 0;

    return (
        <div className={`App ${startMove ? 'start' : ''}`} id="app">
            <div>
                {collections.length > 0 && !startMove && renderSelect()}
                <Menu
                    meta={metaBtns}
                    endMove={endMove}
                    currentScreenIdsLength={currentScreenIds.length}
                    theme={{
                        token: theme.tokenPrimary
                    }}
                    onClickDrag={() => {
                        setIsResize(false);
                        setStartMove(true);
                        setEndMove(false);
                    }}
                    onClickCheck={() => {
                        setIsResize(false);
                        setEndMove(true);
                        setStartMove(false);
                        setCurrentBlockId('');
                        store.updScreenPosition(locations, currentCollectionId);
                        setLocations({});
                    }}
                />
            </div>
            {
                isLengthCopiedScreens &&
                !copiedScreens[currentCollectionId] && <div className='paste_btn'>
                    <ConfigProvider theme={{
                        components: {
                            Button: theme.buttonDefault
                        },
                        token: theme.tokenDefault
                    }}>
                        <Button type="default" onClick={() => store.copyScreensToCollection(currentCollectionId)}>
                            Paste
                        </Button>
                    </ConfigProvider>
                </div>
            }
            <DrawerContainer
                open={openDrawer}
                setOpen={(value) => setOpenDrawer(value)}
                title={getTitleDrawer(currentDrawerMode)}
            >
                {renderDrawer(currentDrawerMode)}
            </DrawerContainer>
            {
                (screens) && screens.map((screen) => {
                    if (currentScreenIds.includes(screen.id)) {
                        return <ScreenBlock
                            key={screen.id}
                            id={screen.id}
                            name={screen.name}
                            path={screen.path}
                            updTime={screen.updTime}
                            chartData={screen.chartData}
                            _startMove={startMove}
                            _endMove={endMove}
                            isResize={isResize}
                            initPositions={screen.initPositions[currentCollectionId] as Location || Object.values(screen.initPositions)[0]}
                            remove={(id: string) => store.removeScreen(id)}
                            passLocation={(location: LocationScreenBlock) => {
                                setCurrentBlockId(Object.keys(location)[0]);
                                setLocations((prev) => {
                                    return { ...prev, ...location };
                                });
                            }}
                            handlerEdit={() => {
                                setCurrentDrawerMode(DrawerMode.EditScreen);
                                setCurrentIdScreen(screen.id)
                                setOpenDrawer(true);
                            }}
                            isCopied={isCopied[screen.id]}
                            onCopy={() => onCopy(screen)}
                        />
                    }
                })               
            }
        </div>
    );
}

export default observer(Index);