//
//  selfie.js
//  scripts/system/
//
//  Created by David Kelly on 21 July 2016
//  Copyright 2016 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

var DWELL_BETWEEN_SNAPSHOTS = 1000; // 1000ms
var SELFIE_TIMEOUT = 5000 // 5000 ms

var toolBar = Toolbars.getToolbar("com.highfidelity.interface.toolbar.system");

var button = toolBar.addButton({
    objectName: "selfie",
    imageURL: Script.resolvePath("assets/images/tools/snap.svg"),
    visible: true,
    buttonState: 1,
    defaultState: 1,
    hoverState: 3,
    alpha: 0.9,
});

var resetOverlays = Menu.isOptionChecked("Overlays");
 

function prepareSelfie() {
    Window.prepareForSelfie();
}

function takeSelfie() {
    Script.setTimeout(function() {
        Window.takeSelfie(false);
    }, SELFIE_TIMEOUT);
}

function takeSnapshot(path) {
    // the selfie path is not needed
    Script.setTimeout(function() {
        Window.takeSnapshot(false);
    }, DWELL_BETWEEN_SNAPSHOTS);
}

function resetButtons() {
    if(resetOverlays) {
        Menu.setIsOptionChecked("Overlays", true);
    }
    toolBar.writeProperty('visible', true);
    button.writeProperty('buttonState', 1);
    button.writeProperty('defaultState', 1);
    button.writeProperty('hoverState',  3);
}


function onClicked() {
    button.writeProperty('buttonState', 0);
    button.writeProperty('defaultState', 0);
    button.writeProperty('hoverState',  2);
    if(resetOverlays) {
        Menu.setIsOptionChecked("Overlays", false);
    }
    toolBar.writeProperty('visible', false);
    prepareSelfie();
}

button.clicked.connect(onClicked);

Window.selfiePrepared.connect(takeSelfie);
Window.selfieTaken.connect(takeSnapshot);
Window.snapshotTaken.connect(resetButtons);

Script.scriptEnding.connect(function () {
    toolBar.removeButton("selfie");
    button.clicked.disconnect(onClicked);
});


