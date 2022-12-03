/*
 * 2019, 2021 Tarpeeksi Hyvae Soft
 *
 * Software: Lintulista
 * 
 * Provides functions for client-to-backend interaction.
 * 
 */

"use strict";

import {ll_assert,
        ll_assert_type,
        ll_assert_native_type} from "./assert.js";
import {ll_backend_request} from "./backend-request.js";
import {LL_Observation} from "./observation.js";
import {LL_Bird} from "./bird.js";
import {LL_BaseType} from "./base-type.js";

// Provides mediated access to the given list's data in Lintulista's backend.
export async function LL_Backend(listKey, reduxStore)
{
    const knownBirds = Object.freeze(await ll_backend_request.get_known_birds_list());

    reduxStore.dispatch({
        type: "set-known-birds",
        knownBirds: knownBirds.reduce((list, bird)=>{
            list.push(LL_Bird.clone(bird));
            return list;
        }, [])
    });

    const observations = await ll_backend_request.get_observations(listKey);
    update_observation_store(observations);

    let loginToken = null;
    let loginValidUntil = undefined;

    // Public interface functions will throw on error.
    const publicInterface = Object.freeze({
        login: async function(username, password)
        {
            ll_assert_native_type("string", username, password);

            const loginDetails = await ll_backend_request.login(listKey, username, password);
            
            ll_assert_native_type("object", loginDetails);
            ll_assert_native_type("string", loginDetails.token);
            ll_assert_native_type("number", loginDetails.until);
            
            loginToken = loginDetails.token;
            loginValidUntil = loginDetails.until;
            reduxStore.dispatch({type: "set-logged-in", isLoggedIn: true});

            window.addEventListener("beforeunload", this.logout);

            return;
        },

        logout: async function()
        {
            ll_assert((loginToken !== null),
                      "Trying to log out without having been logged in.");

            // We're not always in the position to inform the user of logout errors; e.g. when
            // logging out on window close. So we silently ignore errors and proceed as if the
            // logout succeeded.
            try {
                await ll_backend_request.logout(listKey, loginToken);
            }
            catch (error) {
                console.warn("Ignoring logout error:", error);
            }
            finally {
                loginToken = null;
                loginValidUntil = undefined;
                reduxStore.dispatch({type: "set-logged-in", isLoggedIn: false});

                window.removeEventListener("beforeunload", this.logout);
            }

            return;
        },

        // Removes the given observation from the server-side list of observations. Updates
        // the local cache of observations, accordingly. Returns true if successful; false
        // otherwise.
        delete_observation: async function(observation = LL_Observation)
        {
            ll_assert_native_type("string", listKey);
            ll_assert_type(LL_Observation, observation);

            const obsIdx = observations.findIndex(obs=>(obs.species === observation.species));
            ll_assert((obsIdx >= 0), "Unrecognized observation data.");

            await ll_backend_request.delete_observation(observation, listKey, loginToken);

            observations.splice(obsIdx, 1);
            update_observation_store(observations);

            return;
        },

        // Appends the given observation to the server-side list of observations. If an
        // observation of this species already exists, it'll be updated with this new info.
        // Returns true if successful; false otherwise.
        add_observation: async function(observation = LL_Observation)
        {
            ll_assert_type(LL_Observation, observation);

            const obsIdx = observations.findIndex(obs=>(obs.species === observation.species));

            await ll_backend_request.put_observation(observation, listKey, loginToken);

            observations.splice(obsIdx, (obsIdx !== -1), observation);
            update_observation_store(observations);

            return;
        },

        ...LL_BaseType(LL_Backend)
    });

    // For the Electron version of Lintulista, the user is logged in by virtue of
    // launching the app.
    await publicInterface.login("electron-user", "blaablaablaa");

    return publicInterface;

    function update_observation_store(observations = [LL_Observation])
    {
        reduxStore.dispatch({
            type: "set-observations",
            observations: observations.reduce((list, obs)=>{
                list.push(LL_Observation.clone(obs));
                return list;
            }, [])
        });

        return;
    }
}

LL_Backend.is_parent_of = function(candidate)
{
    return ((LL_BaseType.type_of(candidate) === LL_Backend) &&
            candidate.hasOwnProperty("login") &&
            candidate.hasOwnProperty("logout") &&
            candidate.hasOwnProperty("delete_observation") &&
            candidate.hasOwnProperty("add_observation"));
}

// Convenience aliases.
LL_Backend.create_new_list = ll_backend_request.create_new_list;
LL_Backend.get_known_birds_list = ll_backend_request.get_known_birds_list;
