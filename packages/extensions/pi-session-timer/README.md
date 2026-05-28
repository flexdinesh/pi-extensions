# pi-session-timer

Session timer for the [pi coding agent](https://github.com/earendil-works/pi/tree/main/packages/coding-agent).

## What it does

Tracks elapsed time since a session started, shown in the status bar. Pauses automatically when the agent goes idle.

## How to use

No commands — it runs automatically when a session starts. The timer appears in the status bar and updates every second.

## How it works

- **Timer starts** on `session_start`.
- **Resumes** when agent starts processing (`agent_start`), on user input (`input`), or when user runs bash (`user_bash`).
- **Pauses** 10 seconds after the agent finishes (`agent_end` + grace period).
- **Cleans up** on `session_shutdown`.

The display dims when paused and highlights when running.

## Install

Install the whole monorepo as a local Pi package:

```bash
pi install /Users/dineshpandiyan/workspace/pi-extensions
```

Or symlink only this extension package for auto-discovery:

```bash
ln -s /Users/dineshpandiyan/workspace/pi-extensions/packages/extensions/pi-session-timer ~/.pi/agent/extensions/session-timer
```

Restart pi or run `/reload` to load the extension.
