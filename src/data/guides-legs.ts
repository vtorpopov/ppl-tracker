import type { Guide } from './guide';

/** Quads, hamstrings, glutes, calves and hips. */
export const LEG_GUIDES: Record<string, Guide> = {
  'Back Squat': {
    setup: ['Set the bar in a rack at upper-chest height.', 'Step under it and rest it on your upper back (not your neck).', 'Grip the bar, stand up to unrack, and take 2–3 steps back. Feet shoulder-width, toes slightly out.'],
    steps: ['Take a big breath and brace your stomach.', 'Sit down and back, letting your knees travel forward over your toes.', 'Go down until your hips are at least level with your knees (or as deep as you can control).', 'Drive up through your whole foot to stand tall.'],
    tips: ['Knees follow the direction of your toes.', 'Keep your chest up and back flat.', 'Set the safety bars just below your bottom position.'],
    mistakes: ['Knees caving inward.', 'Heels lifting off the floor.', 'Rounding your lower back at the bottom.'],
  },
  'Front Squat': {
    setup: ['Set the bar at upper-chest height in a rack.', 'Rest the bar on the front of your shoulders, close to your neck.', 'Fingertips under the bar (or arms crossed), elbows pointing forward and high.'],
    steps: ['Unrack, step back, feet about shoulder width.', 'Brace and squat straight down, keeping your torso upright.', 'Go as deep as you can with elbows up.', 'Stand back up, leading with your chest.'],
    tips: ['Elbows up = bar stays on your shoulders.', 'Works the quads more than a back squat.'],
    mistakes: ['Elbows dropping so the bar rolls forward.', 'Leaning forward.', 'Heels coming up.'],
  },
  'Hack Squat': {
    setup: ['Step onto the platform with your back and shoulders against the pads.', 'Feet shoulder-width, middle of the platform.', 'Release the safety handles.'],
    steps: ['Lower yourself slowly, bending your knees.', 'Go down until your thighs are at least parallel to the platform.', 'Press back up without locking your knees hard.'],
    tips: ['Feet lower on the platform = more quads.', 'Keep your lower back pressed into the pad.'],
    mistakes: ['Heels lifting.', 'Shallow reps.', 'Forgetting to re-engage the safeties.'],
  },
  'Leg Press': {
    setup: ['Sit with your back and hips flat against the pad.', 'Feet shoulder-width on the platform.', 'Release the safety handles.'],
    steps: ['Lower the platform by bending your knees toward your chest.', 'Stop before your lower back starts to curl off the pad.', 'Press back up without locking your knees.'],
    tips: ['Feet higher = more glutes; lower = more quads.', 'Control the way down.'],
    mistakes: ['Hips lifting off the seat at the bottom.', 'Locking your knees straight at the top.', 'Tiny reps with too much weight.'],
  },
  'Bulgarian Split Squat': {
    setup: ['Stand about two feet in front of a bench, facing away from it.', 'Place the top of your back foot on the bench.', 'Hold dumbbells at your sides (or no weight to start).'],
    steps: ['Lower straight down by bending your front knee.', 'Go until your back knee is near the floor.', 'Push through your front foot to stand back up.', 'Do all reps, then switch legs.'],
    tips: ['A slight forward lean works more glutes; upright works more quads.', 'Find your foot position before adding weight.'],
    mistakes: ['Front foot too close to the bench.', 'Front knee caving inward.', 'Pushing off the back foot.'],
  },
  'Leg Extension': {
    setup: ['Adjust the back pad so your knees line up with the machine pivot.', 'Set the shin pad just above your ankles.', 'Hold the side handles.'],
    steps: ['Straighten your legs to lift the pad.', 'Squeeze your quads at the top.', 'Lower slowly.'],
    tips: ['A one-second pause at the top makes it work harder.', 'Keep your hips down in the seat.'],
    mistakes: ['Swinging the weight up.', 'Hips lifting off the seat.', 'Dropping the weight on the way down.'],
  },
  'Romanian Deadlift': {
    setup: ['Stand holding a barbell at your hips, overhand grip, shoulder width.', 'Feet hip-width apart, knees slightly bent.', 'Shoulders back, chest up.'],
    steps: ['Push your hips straight back, letting the bar slide down your thighs.', 'Keep your back flat and knees fixed in a slight bend.', 'Stop when you feel a strong hamstring stretch (usually around mid-shin).', 'Drive your hips forward to stand back up.'],
    tips: ['Think "close a car door with your butt."', 'Keep the bar touching your legs.'],
    mistakes: ['Rounding your back to reach lower.', 'Bending your knees more and turning it into a squat.', 'Bar drifting away from your legs.'],
  },
  'Lying Leg Curl': {
    setup: ['Lie face-down on the machine.', 'Set the pad just above your heels.', 'Knees just off the edge of the bench, hands on the handles.'],
    steps: ['Curl your heels toward your butt.', 'Squeeze your hamstrings at the top.', 'Lower slowly until your legs are almost straight.'],
    tips: ['Press your hips into the pad the whole time.', 'Point your toes up toward your shins.'],
    mistakes: ['Hips lifting off the pad.', 'Swinging the weight.', 'Short reps.'],
  },
  'Seated Leg Curl': {
    setup: ['Adjust the back pad so your knees line up with the pivot.', 'Lower pad sits just above your ankles; lap pad snug on your thighs.', 'Sit upright and hold the handles.'],
    steps: ['Curl the pad down and under the seat.', 'Squeeze at the bottom.', 'Return slowly until your legs are nearly straight.'],
    tips: ['Leaning your torso forward a little increases the stretch.', 'Control the return.'],
    mistakes: ['Lap pad too loose.', 'Rushing the reps.', 'Letting the weight slam.'],
  },
  'Hip Thrust': {
    setup: ['Sit with your upper back against a bench, the bar over your hips (use a pad).', 'Feet flat, about hip-width apart.', 'Roll the bar up over your hips.'],
    steps: ['Drive through your heels and lift your hips up.', 'At the top, your body is flat from shoulders to knees, shins vertical.', 'Squeeze your glutes, then lower slowly.'],
    tips: ['Tuck your chin and keep your ribs down.', 'Pause at the top for a full squeeze.'],
    mistakes: ['Arching your lower back instead of using your glutes.', 'Feet too far out or too close.', 'Not reaching full hip extension.'],
  },
  'Standing Calf Raise': {
    setup: ['Set the shoulder pads so you stand with legs nearly straight.', 'Put the balls of your feet on the edge of the platform.', 'Let your heels drop below the platform.'],
    steps: ['Rise up onto your toes as high as you can.', 'Pause at the top.', 'Lower slowly into a deep stretch.'],
    tips: ['Calves respond to full range and slow reps.', 'Pause for a second at the bottom to avoid bouncing.'],
    mistakes: ['Bouncing at the bottom.', 'Bending your knees.', 'Tiny reps.'],
  },
  'Seated Calf Raise': {
    setup: ['Sit with the balls of your feet on the platform.', 'Place the knee pad snug on your lower thighs.', 'Release the safety lever.'],
    steps: ['Lower your heels into a deep stretch.', 'Push up onto your toes as high as you can.', 'Pause, then lower slowly.'],
    tips: ['Bent-knee calf raises target the soleus, a deeper calf muscle.', 'Full range beats heavy weight.'],
    mistakes: ['Bouncing.', 'Half reps.', 'Pushing with your hands.'],
  },

  // ---- Added exercises ----
  'Pendulum Squat': {
    setup: ['Step onto the platform with your back against the pad and shoulders under the pads.', 'Feet about shoulder width.', 'Release the safety.'],
    steps: ['Squat down, letting the machine swing in its arc.', 'Go as deep as you comfortably can.', 'Press back up without locking your knees.'],
    tips: ['Very quad-focused and easy on the lower back.', 'Keep your heels down.'],
    mistakes: ['Heels lifting.', 'Bouncing out of the bottom.', 'Shallow reps.'],
  },
  'Smith Machine Squat': {
    setup: ['Set the bar at upper-chest height and the safety stops just below your squat depth.', 'Step under it, bar on your upper back.', 'Feet shoulder width, slightly in front of the bar.'],
    steps: ['Twist to unhook the bar and brace.', 'Squat down with control.', 'Stand back up, then twist to re-hook when finished.'],
    tips: ['Feet further forward works more glutes; under the bar works more quads.', 'The fixed path helps you train hard without a spotter.'],
    mistakes: ['Feet directly under the bar so knees shoot far forward.', 'Forgetting to re-hook.', 'Bouncing at the bottom.'],
  },
  'Leg Press Calf Raise': {
    setup: ['Sit in the leg press and press the platform up.', 'Slide your feet down so only the balls of your feet are on the bottom edge.', 'Keep the safety handles engaged if possible.'],
    steps: ['Push the platform away by pointing your toes.', 'Pause at the top.', 'Let your toes come back slowly into a deep stretch.'],
    tips: ['Knees stay straight but not hard-locked.', 'Slow, full reps.'],
    mistakes: ['Feet slipping off the platform.', 'Bending your knees.', 'Bouncing.'],
  },
  'Hip Abduction': {
    setup: ['Sit in the machine with the pads on the outside of your knees.', 'Set a starting width you can control.', 'Sit up tall, hands on the handles.'],
    steps: ['Push your knees out against the pads.', 'Pause at the widest point.', 'Return slowly.'],
    tips: ['Leaning forward slightly targets more of the upper glutes.', 'Control the return — do not let the plates slam.'],
    mistakes: ['Using momentum.', 'Rocking your torso.', 'Partial reps.'],
  },
  'Hip Adduction': {
    setup: ['Sit in the machine with the pads on the inside of your knees.', 'Set a starting width that gives a gentle stretch.', 'Sit tall, back against the pad.'],
    steps: ['Squeeze your legs together.', 'Pause when the pads meet.', 'Open back up slowly.'],
    tips: ['Strong inner thighs help your squats and knee stability.', 'Start with a smaller stretch and widen over time.'],
    mistakes: ['Starting too wide and straining the groin.', 'Letting the weight snap your legs open.', 'Leaning forward.'],
  },
  'Cable Glute Kickback': {
    setup: ['Attach an ankle strap to a low pulley.', 'Face the machine and hold it for balance.', 'Hinge forward slightly, standing leg slightly bent.'],
    steps: ['Kick your strapped leg straight back.', 'Squeeze your glute at the top.', 'Return slowly.'],
    tips: ['Move from the hip, not the lower back.', 'Small range with a strong squeeze works best.'],
    mistakes: ['Arching your lower back to kick higher.', 'Swinging the leg.', 'Twisting your hips open.'],
  },
  'Cable Pull-Through': {
    setup: ['Attach a rope to a low pulley.', 'Face away from the machine, straddling the cable, holding the rope between your legs.', 'Walk forward until there is tension, feet a bit wider than hips.'],
    steps: ['Push your hips back, letting the rope travel between your legs.', 'Keep your back flat and knees softly bent.', 'Drive your hips forward to stand tall and squeeze your glutes.'],
    tips: ['A friendly way to learn the hip hinge.', 'Arms just hold the rope — your hips do the work.'],
    mistakes: ['Squatting down instead of hinging.', 'Pulling with your arms.', 'Leaning back at the top.'],
  },
  'Back Extension': {
    setup: ['Adjust the 45° bench so the top of the pad sits just below your hip bones.', 'Hook your ankles under the foot pads.', 'Cross your arms over your chest (or hold a plate).'],
    steps: ['Bend at the hips to lower your torso.', 'Go until you feel a stretch in your hamstrings.', 'Raise back up until your body forms a straight line — not past it.'],
    tips: ['Squeeze your glutes to lift.', 'Round the upper back slightly to target glutes more.'],
    mistakes: ['Hyperextending (arching) at the top.', 'Pad too high so you cannot bend at the hips.', 'Swinging up fast.'],
  },
  'Goblet Squat': {
    setup: ['Hold a dumbbell or kettlebell vertically against your chest.', 'Feet shoulder width, toes slightly out.', 'Elbows pointing down.'],
    steps: ['Sit down between your heels, keeping your chest up.', 'Go as deep as you can with a flat back.', 'Stand back up through your whole foot.'],
    tips: ['The best way to learn the squat.', 'Your elbows can gently push your knees out at the bottom.'],
    mistakes: ['Weight drifting away from your chest.', 'Heels lifting.', 'Knees caving in.'],
  },
  'Dumbbell Romanian Deadlift': {
    setup: ['Stand holding dumbbells in front of your thighs.', 'Feet hip-width, knees slightly bent.', 'Shoulders back, back flat.'],
    steps: ['Push your hips back, sliding the dumbbells down your legs.', 'Stop when you feel a strong hamstring stretch.', 'Drive your hips forward to stand up.'],
    tips: ['Keep the dumbbells close to your legs.', 'Only go as low as you can with a flat back.'],
    mistakes: ['Rounding your back.', 'Bending the knees too much.', 'Looking up and straining the neck.'],
  },
  'Walking Lunge': {
    setup: ['Stand tall with dumbbells at your sides (or no weight).', 'Feet hip-width apart.', 'Brace your core.'],
    steps: ['Take a long step forward.', 'Lower until your back knee is just above the floor.', 'Push through your front foot and step the back leg forward into the next lunge.', 'Keep alternating legs as you walk.'],
    tips: ['Longer steps work more glutes; shorter steps more quads.', 'Count each leg as one rep or count pairs — just be consistent.'],
    mistakes: ['Front knee caving inward.', 'Leaning way forward.', 'Back knee slamming into the floor.'],
  },
  'Reverse Lunge': {
    setup: ['Stand tall with dumbbells at your sides (or no weight).', 'Feet hip-width apart.', 'Brace your core.'],
    steps: ['Step one foot back.', 'Lower until your back knee is just above the floor.', 'Push through your front foot to return to standing.', 'Alternate legs or finish one side first.'],
    tips: ['Easier on the knees than forward lunges.', 'Keep most of your weight on the front foot.'],
    mistakes: ['Stepping back too short.', 'Front knee caving in.', 'Pushing off the back foot.'],
  },
  'Step-Up': {
    setup: ['Stand facing a sturdy box or bench, about knee height.', 'Hold dumbbells at your sides (or no weight).', 'Place one whole foot on the box.'],
    steps: ['Drive through the top foot to stand up on the box.', 'Bring the other foot up (or keep it hovering).', 'Step down slowly with the same leg you lead with.', 'Do all reps, then switch legs.'],
    tips: ['Let the top leg do the work — do not push off the bottom foot.', 'Lower box = easier; higher box = more glutes.'],
    mistakes: ['Bouncing off the floor foot.', 'Leaning way forward.', 'Box too high to control.'],
  },
  'Single-Leg Calf Raise': {
    setup: ['Stand on one foot on the edge of a step, ball of the foot on the edge.', 'Hold a wall or rail for balance.', 'Hold a dumbbell in the other hand for extra load if needed.'],
    steps: ['Lower your heel below the step for a stretch.', 'Rise up onto your toes as high as you can.', 'Pause and lower slowly. Switch legs.'],
    tips: ['Great at home with no machine.', 'Slow reps make even bodyweight hard.'],
    mistakes: ['Bouncing.', 'Bending the knee to help.', 'Leaning heavily on the wall.'],
  },
  'Kettlebell Swing': {
    setup: ['Stand with feet a bit wider than shoulders, kettlebell on the floor in front of you.', 'Hinge at the hips and grab the handle with both hands.', 'Back flat, shoulders over the bell.'],
    steps: ['Hike the bell back between your legs like a football snap.', 'Snap your hips forward to swing it up to chest height.', 'Let it fall back, hinging at the hips to absorb it.', 'Repeat in a smooth rhythm.'],
    tips: ['It is a hinge, not a squat — power comes from your hips.', 'Arms are just ropes; do not lift with them.'],
    mistakes: ['Squatting down instead of hinging.', 'Lifting the bell with your arms or shoulders.', 'Leaning back at the top.'],
  },
  'Bodyweight Squat': {
    setup: ['Stand with feet shoulder width, toes slightly out.', 'Arms out in front for balance.', 'Chest up, core braced.'],
    steps: ['Sit down and back as if into a chair.', 'Go as deep as you can with heels down.', 'Stand back up by pushing through your feet.'],
    tips: ['Great warm-up and beginner exercise.', 'Make it harder with a slow 3-second lowering.'],
    mistakes: ['Knees caving in.', 'Heels lifting.', 'Rounding your back.'],
  },
  'Glute Bridge': {
    setup: ['Lie on your back with knees bent and feet flat, hip-width apart.', 'Arms by your sides.', 'Heels close enough to almost touch with your fingertips.'],
    steps: ['Push through your heels and lift your hips.', 'Stop when your body is a straight line from shoulders to knees.', 'Squeeze your glutes for 1–2 seconds, then lower.'],
    tips: ['Put a dumbbell on your hips or do one leg at a time to progress.', 'Tuck your pelvis slightly before lifting.'],
    mistakes: ['Arching your lower back at the top.', 'Pushing through your toes.', 'Rushing reps.'],
  },
  'Nordic Curl': {
    setup: ['Kneel on a pad with your ankles anchored (a partner, a loaded bar, or a bench pad).', 'Body straight from knees to head.', 'Hands ready in front of your chest.'],
    steps: ['Lean forward slowly, keeping your hips straight.', 'Resist with your hamstrings for as long as you can.', 'Catch yourself with your hands, then push back up to the start.'],
    tips: ['Very hard — even a slow partial lowering counts.', 'Proven to help prevent hamstring injuries.'],
    mistakes: ['Bending at the hips.', 'Dropping fast.', 'Doing too many reps too soon (very sore hamstrings).'],
  },
};
