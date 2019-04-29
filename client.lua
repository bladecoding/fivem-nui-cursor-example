function GetMouseXY()
  local screenWidth, screenHeight = GetActiveScreenResolution()
  local x = GetDisabledControlNormal(2, 239)
  local y = GetDisabledControlNormal(2, 240)
  return screenWidth * x, screenHeight * y
end

local WheelVisible = false
local lastX, lastY
Citizen.CreateThread(function()
  while true do
    if WheelVisible then
      
      DisableControlAction(0,24, true) -- disable attack
      DisableControlAction(0,25, true) -- disable aim
      DisableControlAction(0, 1, true) -- LookLeftRight
      DisableControlAction(0, 2, true) -- LookUpDown
      
      local x, y = GetMouseXY()
      if IsDisabledControlJustPressed(2, 237) then
        SendNUIMessage({
          action = 'Mouse',
          type = 'mousedown',
          x = x,
          y = y
        })
      elseif IsDisabledControlJustReleased(2, 237) then
        SendNUIMessage({
          action = 'Mouse',
          type = 'mouseup',
          x = x,
          y = y
        })
      end
      if x ~= lastX or y ~= lastY then
        SendNUIMessage({
          action = 'Mouse',
          type = 'mousemove',
          x = x,
          y = y
        })
        lastX = x
        lastY = y
      end
    end
    Wait(0)
  end
end)

RegisterCommand("wheel", function()
  SetCursorLocation(0.5, 0.5) --Doesn't work (see: https://github.com/citizenfx/fivem/blob/8ea6d83baf5fcd6940f9132fb8f8b1280fd1117c/code/components/rage-input-five/src/InputHook.cpp#L122)
  WheelVisible = not WheelVisible
  SendNUIMessage({
    action = 'SetVisible',
    visible = WheelVisible
  })
end)

RegisterNUICallback('wheelResult', function(data, cb)
  WheelVisible = false
  TriggerEvent("chat:addMessage", { color = { 255, 255, 255 }, args = {'', 'Clicked: ' .. data.clickedTitle}})
  cb('ok')
end)
