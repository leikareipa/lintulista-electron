/*
 * 2021 Tarpeeksi Hyvae Soft
 * 
 * Software: Lintulista
 * 
 */

"use strict";

import {ll_assert,
        ll_assert_native_type} from "./assert.js";
import {store} from "./redux-store.js";
import {lla_start_lintulista} from "./action-start-lintulista.js";
import {lla_route_hash_url} from "./action-route-hash-url.js";

const routes = [
    { // View a list (e.g. "#aaaaaaaaa" or #aaaaaaaaa/lang/lat").
        url: new RegExp("^#[a-z0-9]{9}($|/)"),
        go: route_list,
    },
    { // Default route for when no others match.
        url: /.*/,
        go: route_404,
    }
];

// Routes the page to the given URL (of the form "#...", e.g "#/guide/" or
// "#aaaaaaaaa/lang/enEN").
export async function ll_hash_route(lintulistaUrl = "")
{
    await lla_route_hash_url.async({
        lintulistaUrl,
        routes
    });

    return;
}

// Modifies the current URL hash with the given parameter.
export function ll_hash_navigate(parameter, newValue)
{
    ll_assert_native_type("string", parameter, newValue);

    switch (parameter)
    {
        case "language": {
            add_part_to_window_hash("lang", newValue);
            store.dispatch({type:"set-language", language:newValue});
            break;
        }
    }

    return;
}

function add_part_to_window_hash(parameter = "", value = "")
{
    ll_assert_native_type("string", parameter, value);

    // Remove the hash change watcher, since we want to modify the hash without
    // reloading.
    const oldOnHashChangeHandler = window.onhashchange;
    window.onhashchange = undefined;

    window.location.hash = hash_with_parameter(parameter, value);

    // If the onHashChange handler is restored immediately, the page will reload
    // (in Chrome, at least), which we don't want.
    setTimeout(()=>{
        window.onhashchange = oldOnHashChangeHandler;
    }, 0);

    return;
}

function hash_with_parameter(parameter = "", value = "")
{
    ll_assert_native_type("string", parameter, value);

    let hash = window.location.hash.replace("#", "");
    const parameterRegexp = new RegExp(`${parameter}/.*(/|$)`);

    if (hash.match(parameterRegexp)) {
        hash = hash.replace(parameterRegexp, `${parameter}/${value}`);
    }
    else {
        hash += `/${parameter}/${value}`
    }

    return hash;
}

async function route_list(url = "")
{
    const keyRegexp = /^#([a-z0-9]{9})/;
    ll_assert(url.match(keyRegexp), "Invalid list URL.");

    const listKey = url.match(keyRegexp)[1];

    // Enact any startup options given in the URL.
    {
        for (const language of ["fiFI", "enEN", "lat"])
        {
            if (url.match(new RegExp(`\/lang\/${language}\/?`))) {
                store.dispatch({type:"set-language", language});
            }
        }
    }
    
    await lla_start_lintulista.async({listKey});

    return;
}

async function route_404(url = "")
{
    const appElement = document.getElementById("lintulista");
    ll_assert_native_type(Element, appElement);
    appElement.remove();
    
    const iframe = document.createElement("iframe");

    iframe.style.cssText = `
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        border: none;
    `;

    iframe.src = "404.html";

    /// Bit of a kludge to reuse the bluescreen container for the 404 iframe.
    /// In the future, the iframe should have its own container.
    const bsContainer = document.getElementById("blue-screen");
    ll_assert_native_type(Element, bsContainer);
    bsContainer.innerHTML = "";
    bsContainer.appendChild(iframe);
    bsContainer.style.display = "flex";
    bsContainer.style.padding = "0";

    return;
}
