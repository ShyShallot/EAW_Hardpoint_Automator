const { ipcRenderer, clipboard } = require("electron")

var options = [
    { name: 'Type', value : ['HARD_POINT_ENGINE','HARD_POINT_SHIELD_GENERATOR','HARD_POINT_GRAVITY_WELL','HARD_POINT_FIGHTER_BAY','HARD_POINT_TRACTOR_BEAM','HARD_POINT_WEAPON_LASER','HARD_POINT_WEAPON_MISSILE','HARD_POINT_WEAPON_TORPEDO','HARD_POINT_WEAPON_ION_CANNON','HARD_POINT_WEAPON_MASS_DRIVER','HARD_POINT_WEAPON_SPECIAL','HARD_POINT_ENABLE_SPECIAL_ABILITY','HARD_POINT_DUMMY_ART']},
    { name: 'Tooltip_Text', value: "TEXT_TURBOLASER"},
    { name: 'Is_Targetable', value: "Yes"},
    { name: 'Is_Destroyable', value: "Yes"},
    { name: 'Health', value: 100.0},
    { name: 'Is_Turret', value: 'Yes',optional: true, requires: ['Model_To_Attach','Is_Turret','Turret_Rest_Angle','Turret_Rotate_Speed','Turret_Rotate_Extent_Degrees','Turret_Elevate_Extent_Degrees','Turret_Bone_Name','Barrel_Bone_Name']},
    { name: 'Model_To_Attach', value: 'UNSC_TURBO_%%' ,optional: true, requires: ['Model_To_Attach','Is_Turret','Turret_Rest_Angle','Turret_Rotate_Speed','Turret_Rotate_Extent_Degrees','Turret_Elevate_Extent_Degrees','Turret_Bone_Name','Barrel_Bone_Name']},
    { name: 'Turret_Rest_Angle', value: '0.0,0.0,0.0',optional: true, requires: ['Model_To_Attach','Is_Turret','Turret_Rest_Angle','Turret_Rotate_Speed','Turret_Rotate_Extent_Degrees','Turret_Elevate_Extent_Degrees','Turret_Bone_Name','Barrel_Bone_Name']},
    { name: 'Turret_Rotate_Speed', value: 2.0,optional: true, requires: ['Model_To_Attach','Is_Turret','Turret_Rest_Angle','Turret_Rotate_Speed','Turret_Rotate_Extent_Degrees','Turret_Elevate_Extent_Degrees','Turret_Bone_Name','Barrel_Bone_Name']},
    { name: 'Turret_Rotate_Extent_Degrees', value: 2.0,optional: true, requires: ['Model_To_Attach','Is_Turret','Turret_Rest_Angle','Turret_Rotate_Speed','Turret_Rotate_Extent_Degrees','Turret_Elevate_Extent_Degrees','Turret_Bone_Name','Barrel_Bone_Name']},
    { name: 'Turret_Elevate_Extent_Degrees', value: 2.0, optional: true, requires: ['Model_To_Attach','Is_Turret','Turret_Rest_Angle','Turret_Rotate_Speed','Turret_Rotate_Extent_Degrees','Turret_Elevate_Extent_Degrees','Turret_Bone_Name','Barrel_Bone_Name']},
    { name: 'Turret_Bone_Name', value: 'Turret',optional: true, requires: ['Model_To_Attach','Is_Turret','Turret_Rest_Angle','Turret_Rotate_Speed','Turret_Rotate_Extent_Degrees','Turret_Elevate_Extent_Degrees','Turret_Bone_Name','Barrel_Bone_Name']},
    { name: 'Barrel_Bone_Name', value: 'Barrel',optional: true, requires: ['Model_To_Attach','Is_Turret','Turret_Rest_Angle','Turret_Rotate_Speed','Turret_Rotate_Extent_Degrees','Turret_Elevate_Extent_Degrees','Turret_Bone_Name','Barrel_Bone_Name']},
    { name: 'Attachment_Bone', value: 'Mesh_%%'},
    { name: 'Collision_Mesh', value: 'Mesh_%%'},
    { name: 'Damage_Decal', value: 'DECAL', optional: true},
    { name: 'Damage_Particles', value: 'DAMAGE', optional: true},
    { name: 'Engine_Particles', value: 'ENGINES', optional: true},
    { name: 'Fire_Bone_A', value: 'FB_TURBO_%%'},
    { name: 'Fire_Bone_B', value: 'FB_TURBO_%%'},
    { name: 'Randomize_Between_Fire_Bones', value: false, optional: true},
    { name: 'Fire_Cone_Width', value: 2.0},
    { name: 'Fire_Cone_Height', value: 2.0},
    { name: 'Fire_Projectile_Type', value: 'None'},
    { name: 'Blast_Ability_Fire_Projectile_Type', value: 'None', optional: true},
    { name: 'Fire_Min_Recharge_Seconds', value: 2.0},
    { name: 'Fire_Max_Recharge_Seconds', value: 2.0},
    { name: 'Full_Salvo_Weapon_Delay_Multiplier', value: 2.0, optional: true},
    { name: 'Fire_Pulse_Count', value: 2.0},
    { name: 'Fire_Pulse_Delay_Seconds', value: 2.0},
    { name: 'Fire_Range_Distance', value: 2.0},
    { name: 'Fire_Min_Range_Distance', value: 0, optional: true},
    { name: 'Fire_SFXEvent', value: 'Test'},
    { name: 'Fire_Category_Restrictions', value: '', optional: true, continuious: true},
    { name: 'Fire_Inaccuracy_Distance', value: '', continuious: true, optional: true, numberChild: true},
    { name: 'Allow_Opportunity_Fire_When_Targeting', value: true, optional: true},
    { name: 'Allow_Opportunity_Fire_When_Idle', value: true, optional: true},
    { name: 'Fire_When_In_Rocket_Attack_Mode', value: 'No', optional: true},
    { name: 'Fire_When_In_Normal_Attack_Mode', value: 'Yes', optional: true},
    // Add more options as needed
];

let finalValues = [];


let isXMLValid = true;

function validateEntries(entries){
    console.log('checking entries');
    hardpointName = document.getElementById('hardpointName')
    if(hardpointName.value == ""){
        isXMLValid = false;
        hardpointName.setCustomValidity('Please enter a valid Name');
        hardpointName.reportValidity()
    }
    numOfHardpoints = document.getElementById('hardpointAmount')
    if(numOfHardpoints.value == ""){
        isXMLValid = false;
        numOfHardpoints.setCustomValidity('Please enter a valid Number');
        numOfHardpoints.reportValidity()
    }
    for(let i= 0; i < entries.length;i++){
        let entry = entries[i];
        let optionField = getOptionField(entry.name)
        if(entry.value == undefined || optionField == undefined || optionField.value == undefined){
            if(entry[0] !== undefined){
                if(entry.options[entry.selectedIndex].value == 'N/A'){
                    continue;
                }
                finalValues[finalValues.length] = {name: entry.options[entry.selectedIndex].id, value: entry.options[entry.selectedIndex].value};
            }
            if(getOptionField(entry.id) != undefined){
                optionField = getOptionField(entry.id)
            }
            continue;
        }
        //console.log(document.getElementsByClassName(entry.name+"_String"))
        //console.log(document.getElementsByClassName(entry.name+"_String")[entry.getAttribute('count')])
        if(entry.classList.contains('number') && entry.value === "" && document.getElementsByClassName(entry.name+"_String")[entry.getAttribute('count')].value != ""){
            isXMLValid = false;
            entries[i].setCustomValidity('Please enter a valid number');
            entries[i].reportValidity()
            continue;
        }
        if(doesStringContainNumber(optionField.value) && !doesStringContainNumber(entry.value)){
            if(isOptional(entry.name) && entry.value == ""){
                continue;
            }
            isXMLValid = false;
            entries[i].setCustomValidity('Please enter a valid number');
            entries[i].reportValidity()
            continue;
        }
        if(entry.value == "" && isOptionValueString(optionField.value)  && !entry.classList.contains('number') && !isOptional(entry.name)){
            if((!entry.classList.contains('optional') ) || (optionField.optional && entry.value != "")){
                isXMLValid = false;
                entries[i].setCustomValidity('Please enter a valid Name');
                entries[i].reportValidity()
                continue;
            }
        }
        if(entry.value != "" && isOptional(entry.name) && isOptionValueString(optionField.value) && !entry.classList.contains('number') && isOptionValueString(optionField.value) && doesStringContainNumber(entry.value)){
            isXMLValid = false;
            entries[i].setCustomValidity('Please enter a valid Name');
            entries[i].reportValidity()
            continue;
        }
        //console.log(typeof optionField.value, optionField)
        if(isOptionValueString(optionField.value) && doesStringContainNumber(entry.value) && !entry.classList.contains('number')){
            if((!entry.classList.contains('optional') ) || (optionField.optional && entry.value != "")){
                isXMLValid = false;
                entries[i].setCustomValidity('Please enter a valid Name');
                entries[i].reportValidity()
                continue;
            }
        }
        if(optionField.optional && optionField.requires != undefined && entry.value != ""){
            let reqs = optionField.requires;
            for(let y=0;y<reqs.length;y++){
                let secondaryReqField = getOptionField(reqs[y]);
                let secondaryReqValue = document.getElementById(reqs[y]);
                if(secondaryReqValue.value == "" || secondaryReqValue.value == undefined){
                    if(isOptionValueString(secondaryReqField.name)){
                        isXMLValid = false;
                        secondaryReqValue.setCustomValidity('Please enter a valid Number');
                        secondaryReqValue.reportValidity()
                        continue;
                    } else {
                        isXMLValid = false;
                        //secondaryReqValue.setCustomValidity('Please enter a valid Name');
                        //secondaryReqValue.reportValidity()
                        continue;
                    }
                    
                }
            }
        }
        //console.log(entries[i]);
        //entries[i].setCustomValidity('Please enter a valid answer (e.g., 42).');
        //entries[i].reportValidity()
        isXMLValid = true
        let skip = false
        if(entry.name == "Fire_Category_Restrictions"){
            console.log(entry)
            for(let z = 0; z < finalValues.length; z++){
                if(finalValues[z].name == "Fire_Category_Restrictions" && finalValues[z].value !== '' && !finalValues[z].value.includes(entry.value)){
                    console.log(finalValues[z])
                    finalValues[z].value += ", " + entry.value
                    skip = true
                }
            }
        }
        if(skip){
            continue;
        }
        finalValues[finalValues.length] = {name: entry.name, value: entry.value};
    }
}

function clearTurretEntries(finalValues){
    for(let i=0;i<finalValues.length;i++){
        let entry = finalValues[i];
        let optionField = getOptionField(entry.name)
        if(entry.name == "Is_Turret"){
            //console.log(entry)
            if(entry.value == "No" || entry.value == "N/A"){
                for(let y=0;y<finalValues.length;y++){
                    let secondaryEntry = finalValues[y];
                    if(isInArray(secondaryEntry.name,optionField.requires)){
                        //console.log(secondaryEntry)
                        finalValues.splice(y,1);
                        y--;
                    }
                }
            }
        }
    }
    return finalValues
}

function isInArray(lookup, array){
    let found = false
    for(let i=0;i<array.length;i++){
        if(array[i] == lookup){
            found = true;
            return found
        }
    }
    return found
}

function getOptionField(lookup){
    for(let i=0;i<options.length;i++){
        if(options[i].name == lookup){
            return options[i];
        }
    }
    return null
}

function isOptional(optionName){
    let optional = getOptionField(optionName);
    if(optional.optional == false || optional.optional == undefined){
        return false
    }
    return true
}


function doesStringContainNumber(value){
    if(!isNaN(parseInt(value))){
        if(!isNaN(parseFloat(value))){
            return true;
        } else {
            return false
        }
    }
}

function isOptionValueString(value){
    if(doesStringContainNumber(value)){
        return false
    }
    if(typeof value == 'string'){
        return true
    }
    return false
}




window.addEventListener("DOMContentLoaded",() => {
    hardpointName = document.getElementById('hardpointName')
    hardpointName.value = "HP_HARDPOINT_%%"

    numOfHardpoints = document.getElementById('hardpointAmount')
    numOfHardpoints.value = 1
    for(let i=0; i <options.length;i++){
        let labelContainer = document.getElementById('optionsDisplay');
        if(Array.isArray(options[i].value)){
            let selectElem = document.createElement('select');
            selectElem.setAttribute('id','hardpointSelect')
            for(let x = 0; x < options[i].value.length;x++){
                let option = document.createElement('option');
                option.setAttribute('id',options[i].name);
                option.text = options[i].value[x];
                selectElem.add(option);
            }
            let label = document.createElement('a')
            label.innerText = "Hardpoint Type: "
            labelContainer.appendChild(label)
            labelContainer.appendChild(selectElem)
            let br = document.createElement('br');
            labelContainer.appendChild(br);
            continue;
        }
        if(options[i].value == "Yes" || options[i].value == "No"){
            let label = document.createElement('a');
            label.innerHTML = options[i].name + ": ";
            let selectElem = document.createElement('select');
            let option1 = document.createElement('option');
            option1.setAttribute('id',options[i].name);
            option1.text = "Yes";
            selectElem.add(option1);
            let option2 = document.createElement('option');
            option2.setAttribute('id',options[i].name);
            option2.text = "No";
            selectElem.add(option2);
            if(isOptional(options[i].name)){
                let option3 = document.createElement('option');
                option3.setAttribute('id',options[i].name);
                option3.text = "N/A";
                selectElem.add(option3);
            }
            let br = document.createElement('br');
            labelContainer.appendChild(label);
            labelContainer.appendChild(selectElem);
            labelContainer.appendChild(br);
            continue;
        }
        if(typeof options[i].value == 'boolean'){
            let label = document.createElement('a');
            label.innerHTML = options[i].name + ": ";
            label.setAttribute('id', 'boolLabel')
            let selectElem = document.createElement('select');
            selectElem.setAttribute('id', 'boolLabel')
            let option1 = document.createElement('option');
            option1.setAttribute('id',options[i].name);
            option1.text = "True";
            selectElem.add(option1);
            let option2 = document.createElement('option');
            option2.setAttribute('id',options[i].name);
            option2.text = "False";
            selectElem.add(option2);
            let br = document.createElement('br');
            labelContainer.appendChild(label);
            labelContainer.appendChild(selectElem);
            labelContainer.appendChild(br);
            continue;
        }
        let newElemLabel = document.createElement('label');
        newElemLabel.textContent = options[i].name + ": ";
        let newElemInput = document.createElement('input');
        newElemInput.setAttribute('id',options[i].name);
        newElemInput.setAttribute('name',options[i].name);
        newElemInput.setAttribute('class',options[i].name+"_String");
        if(typeof options[i].value === 'number'){
            newElemInput.setAttribute('type','number')
        }
        
        newElemInput.value = options[i].value
        newElemLabel.setAttribute('for',options[i].name);
        labelContainer.appendChild(newElemLabel);
        labelContainer.appendChild(newElemInput);
        if(options[i].continuious){
            if(options[i].numberChild){
                let numberElemInput =  document.createElement('input');
                numberElemInput.setAttribute('id',options[i].name);
                numberElemInput.setAttribute('name',options[i].name);
                numberElemInput.setAttribute('type','number');
                numberElemInput.setAttribute('class', 'number')
                numberElemInput.setAttribute('parent', newElemInput.id+"_String")
                numberElemInput.setAttribute('count',0)
                labelContainer.appendChild(numberElemInput)
                let newElemButton = document.createElement('button')
                newElemButton.innerText = "+";
                newElemButton.setAttribute('id',options[i].name)
                newElemButton.addEventListener('click', function (event){
                    let target = event.target.id
                    let placeBefore = undefined
                    let entries = document.getElementById('optionsDisplay').children;
                    for(let x = 0; x < entries.length; x++){
                        if(entries[x].id == target && entries[x].tagName){
                            placeBefore = entries[x+2]
                            //console.log(placeBefore)
                        }
                    }
                    let clone_label = newElemLabel.cloneNode(true)
                    let clone_input = newElemInput.cloneNode(true)
                    let clone_input_number = numberElemInput.cloneNode(true)
                    clone_input_number.setAttribute('count',parseInt(numberElemInput.getAttribute('count'))+1)
                    clone_input.value = ""
                    clone_input_number.value = ""
                    clone_input.setAttribute('class', `${clone_input.id}_String optional`)
                    clone_input_number.setAttribute('class','number optional')
                    let clone_br = document.createElement('br')
                    labelContainer.appendChild(clone_label)
                    labelContainer.insertBefore(clone_label,placeBefore)
                    labelContainer.appendChild(clone_input)
                    labelContainer.insertBefore(clone_input,placeBefore)
                    labelContainer.appendChild(clone_input_number)
                    labelContainer.insertBefore(clone_input_number,placeBefore)
                    labelContainer.appendChild(clone_br)
                    labelContainer.insertBefore(clone_br,placeBefore)
                    labelContainer.insertBefore(newElemButton,clone_br)
                })
                labelContainer.appendChild(newElemButton)
                let br = document.createElement('br');
                labelContainer.appendChild(br);
                continue
            }
            let newElemButton = document.createElement('button')
            newElemButton.innerText = "+";
            newElemButton.setAttribute('id',options[i].name)
            newElemButton.addEventListener('click', function (event){
                let target = event.target.id
                let placeBefore = undefined
                let entries = document.getElementById('optionsDisplay').children;
                for(let x = 0; x < entries.length; x++){
                    if(entries[x].id == target && entries[x].tagName){
                        placeBefore = entries[x+2]
                        //console.log(placeBefore)
                    }
                }
                let clone_label = newElemLabel.cloneNode(true)
                let clone_input = newElemInput.cloneNode(true)
                clone_input.value = ""
                clone_input.setAttribute('class', `${clone_input.id}_String optional`)
                let clone_br = document.createElement('br')
                labelContainer.appendChild(clone_label)
                labelContainer.insertBefore(clone_label,placeBefore)
                labelContainer.appendChild(clone_input)
                labelContainer.insertBefore(clone_input,placeBefore)
                labelContainer.appendChild(clone_br)
                labelContainer.insertBefore(clone_br,placeBefore)
                labelContainer.insertBefore(newElemButton,clone_br)
            })
            labelContainer.appendChild(newElemButton)
        }
        let br = document.createElement('br');
        labelContainer.appendChild(br);
    }

    document.getElementById('createButton').addEventListener('click', () => {
        if(!isXMLValid){
            return;
        }
        let entries = document.getElementById('optionsDisplay').children;
        //console.log(entries.length);
        finalValues = [];
        validateEntries(entries)
        finalValues = clearTurretEntries(finalValues)
        let output = document.getElementById('output')
        output.innerText = "";
        let cong = "";
        //console.log(numOfHardpoints.value);
        for(let i=0;i<numOfHardpoints.value;i++){
            const num = i + 1
            const numOffset = num + 1;
            //console.log(num, numOffset)
            let numString = `0${num}`;
            let numStringOffset =`0${numOffset}`;
            if(i > 9){
                numString = `${num}`;
                numStringOffset =`${numOffset}`;
            }
            cong += `<Hardpoint Name="${hardpointName.value.replace("%%",numString)}"> \n`
            for(let y=0;y<finalValues.length;y++){
                let value = finalValues[y].value.replace("%%",numString);
                if(value == ''){
                    continue
                }
                let valueOffset = finalValues[y].value.replace("%%",numStringOffset);
                value = value.charAt(0).toUpperCase() + value.slice(1);
                if(finalValues[y].name == "Model_To_Attach"){
                    cong += `\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0<${finalValues[y].name}> ${value}.ALO </${finalValues[y].name}> \n`
                    continue;
                }
                cong+= `\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0<${finalValues[y].name}>${value}</${finalValues[y].name}> \n`
            }
            cong += (`</Hardpoint> \n \n`)
        }
        output.innerText = cong
    })
    
    
})


window.addEventListener('click', () => {
    let entries = document.getElementById('optionsDisplay').children
    validateEntries(entries)
})




