import type { Guide } from './guide';

/** Core and cardio. */
export const CORE_CARDIO_GUIDES: Record<string, Guide> = {
  'Hanging Leg Raise': {
    setup: ['Hang from a pull-up bar, hands about shoulder width.', 'Pull your shoulders down slightly so you are not just dangling.', 'Legs straight and together.'],
    steps: ['Raise your legs in front of you, keeping them as straight as you can.', 'Lift until they are at least level with your hips (higher is harder).', 'Lower slowly without swinging.'],
    tips: ['Curl your pelvis up at the top to really work the abs.', 'Start with Hanging Knee Raises if this is too hard.'],
    mistakes: ['Swinging back and forth.', 'Dropping the legs fast.', 'Only using hip flexors (no pelvic curl).'],
  },
  'Cable Crunch': {
    setup: ['Attach a rope to a high pulley.', 'Kneel facing the machine and hold the rope beside your head.', 'Hips stay high, sitting just off your heels.'],
    steps: ['Crunch down by rounding your spine, bringing your elbows toward your thighs.', 'Squeeze your abs at the bottom.', 'Return slowly until you feel a stretch.'],
    tips: ['Your hips should not move — only your spine curls.', 'Breathe out as you crunch.'],
    mistakes: ['Sitting back onto your heels (using body weight).', 'Pulling with your arms.', 'Bending at the hips instead of curling the spine.'],
  },
  'Ab Wheel Rollout': {
    setup: ['Kneel on a mat holding the ab wheel under your shoulders.', 'Brace your stomach and tuck your pelvis slightly.', 'Arms straight.'],
    steps: ['Roll the wheel forward slowly, letting your body lengthen.', 'Go as far as you can without your lower back sagging.', 'Pull the wheel back in using your abs.'],
    tips: ['Start with short rollouts and go further over time.', 'Rolling toward a wall limits how far you can go.'],
    mistakes: ['Lower back sagging (painful and risky).', 'Hips leading the way back in.', 'Going too far too soon.'],
  },

  // ---- Added exercises ----
  'Hanging Knee Raise': {
    setup: ['Hang from a pull-up bar, hands about shoulder width.', 'Pull your shoulders slightly down.', 'Legs hanging straight.'],
    steps: ['Bring your knees up toward your chest.', 'Curl your hips up at the top.', 'Lower slowly to a still hang.'],
    tips: ['Easier version of the hanging leg raise.', 'Use ab straps if your grip gives out first.'],
    mistakes: ['Swinging.', 'Dropping your legs quickly.', 'Stopping at hip height without curling up.'],
  },
  'Cable Woodchopper': {
    setup: ['Set a pulley high with a single handle.', 'Stand side-on to the machine, feet wider than shoulders.', 'Grab the handle with both hands, arms long.'],
    steps: ['Pull the handle down and across your body to the opposite hip.', 'Rotate through your torso and pivot your back foot.', 'Return slowly to the start. Finish all reps, then switch sides.'],
    tips: ['Arms stay fairly straight — the turn comes from your trunk and hips.', 'Can also go low-to-high.'],
    mistakes: ['Pulling only with your arms.', 'Twisting fast with no control.', 'Rounding your back.'],
  },
  'Pallof Press': {
    setup: ['Set a cable (or band) at chest height with a single handle.', 'Stand side-on, feet shoulder width, and hold the handle at your chest with both hands.', 'Step away until there is tension.'],
    steps: ['Press the handle straight out in front of your chest.', 'Hold for 1–2 seconds without letting your body twist.', 'Bring it back to your chest. Finish all reps, then switch sides.'],
    tips: ['The goal is to resist turning — your core works to stay still.', 'Squeeze your glutes to stay steady.'],
    mistakes: ['Letting the cable twist you toward the machine.', 'Standing too far away.', 'Leaning back.'],
  },
  'Plank': {
    setup: ['Forearms on the floor, elbows under your shoulders.', 'Legs straight, up on your toes.', 'Body in one straight line from head to heels.'],
    steps: ['Squeeze your glutes and brace your stomach.', 'Hold the position, breathing steadily.', 'Stop when your form breaks — log the seconds you held.'],
    tips: ['Push the floor away with your forearms.', 'A shorter perfect plank beats a long saggy one.'],
    mistakes: ['Hips sagging.', 'Butt sticking up in the air.', 'Holding your breath.'],
  },
  'Side Plank': {
    setup: ['Lie on your side with your forearm on the floor, elbow under your shoulder.', 'Stack your feet (or stagger them for balance).', 'Body in a straight line.'],
    steps: ['Lift your hips off the floor.', 'Hold, keeping your body straight from head to feet.', 'Lower, then switch sides. Log the seconds per side.'],
    tips: ['Bend your knees to make it easier.', 'Reach your top arm to the ceiling to make it harder.'],
    mistakes: ['Hips sagging toward the floor.', 'Rolling forward or back.', 'Shoulder shrugging up to the ear.'],
  },
  'Hollow Body Hold': {
    setup: ['Lie on your back with arms overhead and legs straight.', 'Press your lower back firmly into the floor.', 'Tuck your chin slightly.'],
    steps: ['Lift your shoulders and legs a few inches off the floor.', 'Keep your lower back glued to the floor.', 'Hold, breathing steadily. Log the seconds.'],
    tips: ['Bend your knees or bring arms to your sides to make it easier.', 'Lower legs = harder.'],
    mistakes: ['Lower back lifting off the floor.', 'Holding your breath.', 'Straining your neck.'],
  },
  'Dead Bug': {
    setup: ['Lie on your back with arms straight up toward the ceiling.', 'Lift your legs with knees bent at 90° over your hips.', 'Press your lower back into the floor.'],
    steps: ['Slowly lower one arm overhead and the opposite leg toward the floor.', 'Stop just above the floor, keeping your back flat.', 'Return and switch sides.'],
    tips: ['Go slow — it is about control, not speed.', 'Breathe out as you extend.'],
    mistakes: ['Lower back arching off the floor.', 'Moving the same-side arm and leg.', 'Rushing.'],
  },
  'Russian Twist': {
    setup: ['Sit on the floor with knees bent and heels on the ground (or lifted for harder).', 'Lean back slightly with a straight back.', 'Hold your hands or a weight at your chest.'],
    steps: ['Rotate your torso to one side.', 'Rotate to the other side.', 'Count each side as one rep (or pairs — just be consistent).'],
    tips: ['Turn your shoulders, not just your arms.', 'Keep your chest tall.'],
    mistakes: ['Rounding your back.', 'Swinging only the arms.', 'Going too fast to control.'],
  },
  'Bicycle Crunch': {
    setup: ['Lie on your back with hands lightly behind your head.', 'Lift your shoulders and legs off the floor.', 'Lower back pressed into the floor.'],
    steps: ['Bring one knee in while turning the opposite elbow toward it.', 'Straighten that leg as you switch sides.', 'Keep a steady, controlled pace.'],
    tips: ['Slow is better than fast.', 'Rotate through your ribs, not just your elbows.'],
    mistakes: ['Pulling on your neck.', 'Pedaling too fast.', 'Lower back arching.'],
  },
  'Treadmill': {
    setup: ['Stand on the side rails and start the belt slowly.', 'Step on and walk before increasing speed or incline.', 'Clip on the safety key.'],
    steps: ['Walk or run tall with your eyes forward.', 'Raise the incline for a tougher walk instead of just going faster.', 'Log your minutes and distance.'],
    tips: ['Incline walking is low-impact and very effective.', 'Hold the rails only for balance, not to lean on.'],
    mistakes: ['Leaning on the handrails.', 'Looking down at your feet.', 'Jumping on while the belt is fast.'],
  },
  'Outdoor Run': {
    setup: ['Wear supportive running shoes.', 'Start with a 5-minute brisk walk to warm up.', 'Pick a pace where you can still talk in short sentences.'],
    steps: ['Run tall with a slight forward lean from the ankles.', 'Land with your foot under your body, not far in front.', 'Swing your arms forward and back, not across your body.', 'Cool down with a few minutes of walking.'],
    tips: ['Short, quick steps are easier on your joints.', 'Run-walk intervals are a great way to start.'],
    mistakes: ['Overstriding (landing on your heel far in front).', 'Starting too fast.', 'Tense shoulders.'],
  },
  'Stationary Bike': {
    setup: ['Set the seat so your knee is slightly bent at the bottom of the pedal stroke.', 'Handlebars around seat height or a little higher.', 'Tighten the foot straps.'],
    steps: ['Pedal smoothly in full circles.', 'Adjust resistance so it feels like riding up a gentle hill.', 'Log your minutes and distance.'],
    tips: ['Easy on the knees and joints.', 'Intervals: 30 seconds hard, 90 seconds easy.'],
    mistakes: ['Seat too low (knee pain).', 'Bouncing in the saddle.', 'Zero resistance and spinning wildly.'],
  },
  'Rowing Machine': {
    setup: ['Strap your feet in so the strap crosses the widest part of your foot.', 'Set the damper around 3–5.', 'Sit tall and grab the handle.'],
    steps: ['Catch: shins vertical, arms straight, leaning slightly forward.', 'Drive: push with your legs first, then lean back slightly, then pull the handle to your lower ribs.', 'Recovery: arms out, lean forward, then bend the knees to slide back.'],
    tips: ['Order is legs → body → arms on the way back; arms → body → legs on the return.', 'Most of the power comes from your legs.'],
    mistakes: ['Pulling with your arms first.', 'Rounding your back.', 'Damper set to 10 (too heavy, not faster).'],
  },
  'Stair Climber': {
    setup: ['Step on and hold the rails lightly.', 'Start at a slow speed.', 'Stand tall.'],
    steps: ['Step with your whole foot on each stair.', 'Keep an upright posture.', 'Increase speed once you are warmed up. Log your minutes.'],
    tips: ['Taking every other step works the glutes more.', 'Rails are for balance only.'],
    mistakes: ['Leaning heavily on the rails.', 'Hunching forward.', 'Only stepping on your toes.'],
  },
  'Walk': {
    setup: ['Wear comfortable shoes.', 'Stand tall with relaxed shoulders.', 'Pick a route or time goal.'],
    steps: ['Walk at a brisk pace where talking is slightly harder.', 'Swing your arms naturally, opposite to your legs.', 'Log your minutes and distance.'],
    tips: ['Walking is great active recovery between lifting days.', 'Hills make it more challenging.'],
    mistakes: ['Looking down at your phone the whole time.', 'Slouching.', 'Overstriding.'],
  },
  'Elliptical': {
    setup: ['Step on using the handrails, one foot at a time.', 'Stand tall with feet flat on the pedals.', 'Start moving, then pick a program or resistance.'],
    steps: ['Push and pull the handles while your legs stride.', 'Keep your heels down and posture upright.', 'Log your minutes and distance.'],
    tips: ['Very low impact — great for sore joints.', 'Going backward works your legs a bit differently.'],
    mistakes: ['Leaning on the handles.', 'Up on your toes.', 'Resistance so low you are just coasting.'],
  },
  'Jump Rope': {
    setup: ['Size the rope: step on the middle, handles should reach your armpits.', 'Hold the handles at hip height, elbows close.', 'Stand on the balls of your feet.'],
    steps: ['Turn the rope with your wrists, not your arms.', 'Jump just an inch or two off the ground.', 'Land softly on the balls of your feet. Log your minutes.'],
    tips: ['Start with short bursts (30 seconds on, 30 off).', 'Jump on a forgiving surface like wood or rubber.'],
    mistakes: ['Jumping too high.', 'Big arm circles.', 'Landing on your heels.'],
  },
  'Air Bike': {
    setup: ['Set the seat so your knee is slightly bent at the bottom of the stroke.', 'Grip the moving handles.', 'Sit tall.'],
    steps: ['Push and pull the handles while you pedal.', 'The harder you go, the more resistance the fan creates.', 'Log your minutes and distance (or calories in notes).'],
    tips: ['Perfect for short, hard intervals.', 'Use both arms and legs together.'],
    mistakes: ['Going all-out from the start and fading fast.', 'Only using your legs.', 'Seat too low.'],
  },
  'Cycling': {
    setup: ['Check your tire pressure and brakes.', 'Set the saddle so your knee is slightly bent at the bottom of the stroke.', 'Wear a helmet.'],
    steps: ['Pedal at a smooth, steady cadence.', 'Shift to an easier gear before hills.', 'Log your minutes and distance.'],
    tips: ['Higher cadence in an easier gear is kinder to your knees.', 'Be visible: lights and bright clothing.'],
    mistakes: ['Grinding in a very hard gear.', 'Saddle too low.', 'Forgetting to brake gradually.'],
  },
  'Swimming': {
    setup: ['Wear goggles and a swim cap if you have long hair.', 'Warm up with a few easy lengths.', 'Choose a lane matching your speed.'],
    steps: ['Float flat with your face in the water, looking down.', 'Reach forward with one arm and pull water back past your hip.', 'Turn your head to the side to breathe as that arm recovers.', 'Kick from your hips with small, quick kicks. Log your minutes and distance.'],
    tips: ['Breathe out underwater so you only need to breathe in when you turn.', 'A kickboard helps you practice kicking.'],
    mistakes: ['Lifting your head forward to breathe (legs sink).', 'Holding your breath.', 'Big, bent-knee kicks.'],
  },
};
