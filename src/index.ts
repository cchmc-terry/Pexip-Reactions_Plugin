import { registerPlugin } from '@pexip/plugin-api'
import { Emoji, IconAscii, IconSVG } from './Emoji'

const plugin = await registerPlugin({
  id: 'reactions',
  version: 0
})

const animationDuration = 7000

const button = await plugin.ui.addButton({
  position: 'toolbar',
  tooltip: Emoji.Reactions,
  icon: IconSVG.Reactions,
  group: [
    {
      id: Emoji.Angry,
      position: 'toolbar',
      tooltip: Emoji.Angry,
      icon: IconSVG.Angry
    },
    {
      id: Emoji.Applause,
      position: 'toolbar',
      tooltip: Emoji.Applause,
      icon: IconSVG.Applause
    },
    {
      id: Emoji.EyeRoll,
      position: 'toolbar',
      tooltip: Emoji.EyeRoll,
      icon: IconSVG.EyeRoll
    },
    {
      id: Emoji.Happy,
      position: 'toolbar',
      tooltip: Emoji.Happy,
      icon: IconSVG.Happy
    },
    {
      id: Emoji.Heart,
      position: 'toolbar',
      tooltip: Emoji.Heart,
      icon: IconSVG.Heart
    },
    {
      id: Emoji.Laughing,
      position: 'toolbar',
      tooltip: Emoji.Laughing,
      icon: IconSVG.Laughing
    },
    {
      id: Emoji.Sad,
      position: 'toolbar',
      tooltip: Emoji.Sad,
      icon: IconSVG.Sad
    },
    {
      id: Emoji.Surprised,
      position: 'toolbar',
      tooltip: Emoji.Surprised,
      icon: IconSVG.Surprised
    },
    {
      id: Emoji.ThumbDown,
      position: 'toolbar',
      tooltip: Emoji.ThumbDown,
      icon: IconSVG.ThumbDown
    },
    {
      id: Emoji.ThumbUp,
      position: 'toolbar',
      tooltip: Emoji.ThumbUp,
      icon: IconSVG.ThumbUp
    }
  ]
})

button.onClick.add(async ({ buttonId }) => {
  try {
    await plugin.conference.sendApplicationMessage({
      payload: {
        reaction: buttonId
      }
    })
//    await plugin.ui.showToast({
//      message: `You reacted with ${getAsciiIcon(buttonId)}`,
//      isInterrupt: true
//    })
    showReactionGif(buttonId)
  } catch (e) {
    console.error(e)
  }
})

plugin.events.applicationMessage.add(async (appMessage) => {
  const reaction = appMessage.message.reaction as string
  const reactionIcon = getAsciiIcon(reaction)
  await plugin.ui.showToast({
    message: `${appMessage.displayName} reacted with ${reactionIcon}`,
    isInterrupt: true
  })
  showReactionGif(reaction)
})

const getAsciiIcon = (reaction: string): string => {
  let reactionIcon: string
  switch (reaction) {
    case Emoji.Angry:
      reactionIcon = IconAscii.Angry
      break
    case Emoji.Applause:
      reactionIcon = IconAscii.Applause
      break
    case Emoji.EyeRoll:
      reactionIcon = IconAscii.EyeRoll
      break
    case Emoji.Happy:
      reactionIcon = IconAscii.Happy
      break
    case Emoji.Heart:
      reactionIcon = IconAscii.Heart
      break
    case Emoji.Laughing:
      reactionIcon = IconAscii.Laughing
      break
    case Emoji.Sad:
      reactionIcon = IconAscii.Sad
      break
    case Emoji.Surprised:
      reactionIcon = IconAscii.Surprised
      break
    case Emoji.ThumbDown:
      reactionIcon = IconAscii.ThumbDown
      break
    case Emoji.ThumbUp:
      reactionIcon = IconAscii.ThumbUp
      break
    default:
      throw new Error('Received invalid reaction')
  }
  return reactionIcon
}

const showReactionGif = (icon: string): void => {
  const basePath = getBasePath()

  const img = document.createElement('img')
  img.src = `${basePath}/images/${icon.toLowerCase()}.webp`
  img.className = 'reaction-animation'
  img.style.left = `${Math.random() * 100}%`
  img.style.bottom = '0'

  const root = parent.document.querySelector(
    'div[data-testid="in-meeting-video-wrapper"]'
  )

  if (root === null) {
    throw new Error(
      'Could not find video wrapper to attach the reaction animation.'
    )
  }

  root.appendChild(img)

  setTimeout(() => {
    img.remove()
  }, animationDuration)
}

const getBasePath = (): string => {
  return window.location.pathname.slice(
    0,
    window.location.pathname.lastIndexOf('/')
  )
}

const style = document.createElement('link')
style.rel = 'stylesheet'
style.href = getBasePath() + '/style.css'
parent.document.head.appendChild(style)
