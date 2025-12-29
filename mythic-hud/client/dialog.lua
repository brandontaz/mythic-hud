Dialog = {
    isOpen = false,

    Open = function(entity, data)
        Dialog.isOpen = true
        local coords = GetOffsetFromEntityInWorldCoords(entity, 0, 1.5, 0.3)
        local NPCCam = CreateCam('DEFAULT_SCRIPTED_CAMERA', true)
        SetEntityLocallyInvisible(PlayerPedId())
        SetCamActive(NPCCam, true)
        RenderScriptCams(true, true, 500, true, true)
        SetCamCoord(NPCCam, coords.x, coords.y, coords.z + 0.2)
        SetCamRot(NPCCam, 0.0, 0.0, GetEntityHeading(entity) + 180, 5)
        SetCamFov(NPCCam, 40.0)
        SetNuiFocus(true, true)
        TriggerEvent('Weapons:Client:AttachToggle', true)

        SendNUIMessage({
			type = "DialogState",
            data = {
                showing = true,
                firstName = data.first_name,
                lastName = data.last_name,
                tag = data.Tag,
                description = data.description,
                buttons = data.buttons
			},
		})
        SetNuiFocus(true, true)
        Dialog:Invisible()
    end,

    Close = function()
        Dialog.isOpen = false
        TriggerEvent('Weapons:Client:AttachToggle', false)
        RenderScriptCams(false, true, 500, true, true)
        DestroyCam(NPCCam)
        SendNUIMessage({
            type = 'DialogClose'
        })
        SetNuiFocus(false, false)
    end,

    Invisible = function()
        while Dialog.isOpen do
            SetEntityLocallyInvisible(PlayerPedId())
            Wait(1)
        end
    end
}

RegisterNUICallback('DialogResponse', function(data, cb)
    if data.close then
        Dialog:Close()
    end

    if data.event then
        TriggerEvent(data.event, data.params)
    end

    cb(true)
end)

RegisterNetEvent('Dialog:Client:Test', function(entity)
	Dialog.Open(entity.entity, {
		first_name = 'P',
		last_name = 'Diddy',
		Tag = '👿',
		description = 'Do you want to join the diddy party?',
		buttons = {
			{
				label = 'I want to enter !',
				data = { close = true, event = '' }
			},
			{
				label = 'Fuck no get outta here 1000 bottle of baby oil gay pedo ass!',
				data = { close = true }
			}
		}
	})
end)

AddEventHandler("Proxy:Shared:RegisterReady", function()
	exports["mythic-base"]:RegisterComponent("Dialog", Dialog)
end)
