import type { Guide } from './guide';

/** Back, biceps, traps and grip. */
export const PULL_GUIDES: Record<string, Guide> = {
  'Deadlift': {
    setup: ['Stand with feet hip-width apart, the bar over the middle of your feet (about an inch from your shins).', 'Bend down and grip the bar just outside your legs.', 'Bend your knees until your shins touch the bar, chest up, back flat.'],
    steps: ['Take a big breath and brace your stomach hard.', 'Pull the slack out of the bar, then push the floor away with your legs.', 'Keep the bar dragging up your legs as you stand tall.', 'Lower it the same way: hips back first, then bend the knees once it passes them.'],
    tips: ['Think "push the floor," not "pull the bar."', 'Lock your lats by imagining squeezing oranges in your armpits.', 'Finish standing tall — no leaning back.'],
    mistakes: ['Rounding your lower back.', 'Bar drifting away from your legs.', 'Hips shooting up first so it becomes a stiff-leg lift.'],
  },
  'Pull-Up': {
    setup: ['Grip the bar overhand, a little wider than shoulder width.', 'Hang with straight arms.', 'Brace your stomach and squeeze your legs together.'],
    steps: ['Pull your shoulder blades down and back.', 'Pull yourself up by driving your elbows down toward your hips.', 'Get your chin over the bar.', 'Lower all the way down with control.'],
    tips: ['Can\'t do one yet? Do negatives, bands, or the assisted machine.', 'Think "elbows to back pockets."'],
    mistakes: ['Kicking and swinging.', 'Half reps that don\'t reach full arm extension.', 'Shrugging your shoulders up at the top.'],
  },
  'Chin-Up': {
    setup: ['Grip the bar underhand (palms facing you), about shoulder width.', 'Hang with straight arms.', 'Brace your core.'],
    steps: ['Pull your shoulders down, then pull your chest toward the bar.', 'Get your chin over the bar.', 'Lower slowly to a full hang.'],
    tips: ['Uses more biceps than a pull-up — often easier to learn first.', 'Keep your elbows in front of your body.'],
    mistakes: ['Swinging for momentum.', 'Craning your neck to "reach" the bar.', 'Dropping fast on the way down.'],
  },
  'Lat Pulldown': {
    setup: ['Adjust the knee pad so your thighs are locked in.', 'Grip the bar overhand, a bit wider than shoulders.', 'Sit down and lean back slightly.'],
    steps: ['Pull the bar down to your upper chest, driving elbows down and back.', 'Squeeze your back at the bottom.', 'Let the bar rise slowly until your arms are straight.'],
    tips: ['Lead with your elbows, not your hands.', 'Keep your chest up and proud.'],
    mistakes: ['Leaning way back and rowing the weight.', 'Pulling the bar behind your neck.', 'Letting the weight yank you up.'],
  },
  'Barbell Row': {
    setup: ['Hold a barbell with an overhand grip, slightly wider than shoulders.', 'Hinge at the hips until your torso is around 45° or lower.', 'Knees soft, back flat, bar hanging under your shoulders.'],
    steps: ['Pull the bar toward your belly button.', 'Squeeze your shoulder blades together at the top.', 'Lower it under control until your arms are straight.'],
    tips: ['Keep your torso angle the same every rep.', 'Brace your stomach to protect your lower back.'],
    mistakes: ['Standing up more each rep and using momentum.', 'Rounding your back.', 'Elbows flaring straight out.'],
  },
  'Seated Cable Row': {
    setup: ['Sit at the cable row with feet on the platform and knees slightly bent.', 'Grab the handle and sit tall with a flat back.', 'Arms straight, slight forward reach.'],
    steps: ['Pull the handle to your lower ribs, elbows close to your sides.', 'Squeeze your shoulder blades together.', 'Let your arms straighten slowly, allowing your shoulders to reach forward.'],
    tips: ['Your torso can move slightly, but not rock back and forth.', 'Lead with your elbows.'],
    mistakes: ['Leaning way back to heave the weight.', 'Rounding your back at the start.', 'Shrugging toward your ears.'],
  },
  'Chest-Supported Dumbbell Row': {
    setup: ['Set a bench to about 30–45°.', 'Lie face-down with your chest on the pad.', 'Let the dumbbells hang straight down.'],
    steps: ['Row the dumbbells up toward your hips.', 'Squeeze your shoulder blades together.', 'Lower until your arms are straight.'],
    tips: ['The bench removes momentum and spares your lower back.', 'Keep your chest glued to the pad.'],
    mistakes: ['Lifting your chest off the bench.', 'Shrugging instead of rowing.', 'Jerky reps.'],
  },
  'One-Arm Dumbbell Row': {
    setup: ['Put one knee and the same-side hand on a flat bench.', 'Other foot on the floor, back flat and parallel to the floor.', 'Hold the dumbbell with your arm straight.'],
    steps: ['Pull the dumbbell up toward your hip.', 'Pause at the top.', 'Lower until your arm is straight and you feel a stretch.'],
    tips: ['Think "elbow to hip," not "hand to shoulder."', 'Keep your shoulders level — do not twist.'],
    mistakes: ['Twisting your torso to lift the weight.', 'Pulling to the chest with a shrug.', 'Rounding your back.'],
  },
  'T-Bar Row': {
    setup: ['Straddle the bar (or step onto a T-bar machine).', 'Grab the handles and hinge forward with a flat back.', 'Knees slightly bent.'],
    steps: ['Pull the handles toward your chest.', 'Squeeze your back at the top.', 'Lower slowly until your arms are straight.'],
    tips: ['Chest-supported versions are easier on the lower back.', 'Keep the same torso angle every rep.'],
    mistakes: ['Standing up to swing the weight.', 'Rounding your back.', 'Partial reps.'],
  },
  'Straight-Arm Pulldown': {
    setup: ['Set a bar or rope on a high pulley.', 'Step back and hinge slightly at the hips.', 'Arms nearly straight in front of you at about head height.'],
    steps: ['Sweep the bar down in an arc to your thighs, keeping your arms straight.', 'Squeeze your lats at the bottom.', 'Let it rise back up slowly.'],
    tips: ['Great for feeling your lats work.', 'Keep a soft, fixed bend in your elbows.'],
    mistakes: ['Bending your elbows (turns into a pushdown).', 'Leaning your body weight into it.', 'Shrugging.'],
  },
  'Barbell Curl': {
    setup: ['Stand tall holding a barbell with an underhand grip, shoulder-width apart.', 'Arms straight, bar at your thighs.', 'Elbows by your sides.'],
    steps: ['Curl the bar up toward your shoulders.', 'Squeeze your biceps at the top.', 'Lower slowly all the way down.'],
    tips: ['An EZ bar can be kinder to your wrists.', 'Control the lowering for 2–3 seconds.'],
    mistakes: ['Swinging your back to lift the bar.', 'Elbows drifting forward.', 'Stopping halfway down.'],
  },
  'Hammer Curl': {
    setup: ['Stand holding dumbbells at your sides.', 'Palms face each other (neutral grip).', 'Elbows by your sides.'],
    steps: ['Curl the dumbbells up, keeping palms facing each other.', 'Squeeze at the top.', 'Lower slowly.'],
    tips: ['Works the forearm and the brachialis (muscle under the biceps) too.', 'Alternate arms if you like.'],
    mistakes: ['Swinging.', 'Elbows moving forward.', 'Wrists bending.'],
  },
  'Incline Dumbbell Curl': {
    setup: ['Set a bench to 45–60° and sit back.', 'Let your arms hang straight down behind your body.', 'Palms facing forward.'],
    steps: ['Curl the dumbbells up without moving your upper arms.', 'Squeeze at the top.', 'Lower slowly to a full stretch.'],
    tips: ['The stretched starting position makes this very effective.', 'Go lighter than standing curls.'],
    mistakes: ['Shoulders rolling forward off the bench.', 'Swinging up from the bottom.', 'Cutting the stretch short.'],
  },
  'Cable Curl': {
    setup: ['Attach a straight or EZ bar to a low pulley.', 'Stand close, underhand grip, arms straight.', 'Elbows by your sides.'],
    steps: ['Curl the bar up to your shoulders.', 'Squeeze your biceps.', 'Lower slowly until your arms are straight.'],
    tips: ['Cables keep tension through the whole movement.', 'Take a small step back so the cable pulls slightly forward.'],
    mistakes: ['Leaning back.', 'Elbows sliding forward.', 'Letting the stack slam.'],
  },
  'Preacher Curl': {
    setup: ['Sit at a preacher bench with your armpits snug against the top of the pad.', 'Hold an EZ bar underhand, arms resting on the pad.', 'Start with arms nearly straight.'],
    steps: ['Curl the bar up toward your shoulders.', 'Squeeze at the top.', 'Lower slowly, stopping just short of locking out.'],
    tips: ['The pad stops you from cheating — focus on control.', 'Go lighter than regular curls.'],
    mistakes: ['Dropping fast at the bottom (stresses the elbow).', 'Lifting your elbows off the pad.', 'Too heavy.'],
  },

  // ---- Added exercises ----
  'Machine Row': {
    setup: ['Adjust the seat so the handles line up with your mid-chest.', 'Sit with your chest against the pad.', 'Grip the handles with arms straight.'],
    steps: ['Row the handles back, driving your elbows behind you.', 'Squeeze your shoulder blades together.', 'Return slowly to straight arms.'],
    tips: ['Easy to learn and safe to push hard.', 'Try different handle grips to shift the feel.'],
    mistakes: ['Chest coming off the pad.', 'Shrugging.', 'Short reps.'],
  },
  'Bayesian Cable Curl': {
    setup: ['Set a pulley low with a single handle.', 'Face away from the machine, holding the handle behind you.', 'Step forward until your arm is pulled slightly behind your body.'],
    steps: ['Curl the handle forward and up, keeping your elbow behind your torso.', 'Squeeze at the top.', 'Lower slowly into the stretch.'],
    tips: ['The behind-the-body start gives a big biceps stretch.', 'Do one arm at a time.'],
    mistakes: ['Letting the elbow swing forward.', 'Leaning to swing the weight.', 'Skipping the stretch at the bottom.'],
  },
  'Dumbbell Curl': {
    setup: ['Stand tall with dumbbells at your sides, palms forward.', 'Feet shoulder-width apart.', 'Elbows by your sides.'],
    steps: ['Curl both dumbbells (or one at a time) up toward your shoulders.', 'Squeeze at the top.', 'Lower slowly to straight arms.'],
    tips: ['Keep your upper arms still.', 'A slow lowering builds more muscle.'],
    mistakes: ['Swinging your body.', 'Elbows drifting forward.', 'Half reps.'],
  },
  'Concentration Curl': {
    setup: ['Sit on a bench, feet wide.', 'Rest the back of your upper arm against the inside of your thigh.', 'Hold a dumbbell with your arm straight.'],
    steps: ['Curl the dumbbell up toward your shoulder.', 'Squeeze hard at the top.', 'Lower slowly.'],
    tips: ['Your thigh locks the arm in place — no cheating.', 'Great finisher with lighter weight.'],
    mistakes: ['Lifting your elbow off your thigh.', 'Using your body to move the weight.', 'Rushing reps.'],
  },
  'Dumbbell Pullover': {
    setup: ['Lie across or along a flat bench with your upper back supported.', 'Hold one dumbbell with both hands over your chest.', 'Slight bend in your elbows.'],
    steps: ['Lower the dumbbell back over your head in an arc.', 'Stop when you feel a good stretch in your lats and chest.', 'Pull it back over your chest in the same arc.'],
    tips: ['Keep the elbow bend fixed throughout.', 'Start light — the stretch is the point.'],
    mistakes: ['Bending the arms a lot (turns into a triceps extension).', 'Arching your lower back.', 'Going deeper than your shoulders allow.'],
  },
  'Barbell Shrug': {
    setup: ['Stand holding a barbell in front of your thighs, overhand grip, shoulder width.', 'Arms straight, chest up.', 'Use straps if your grip gives out.'],
    steps: ['Raise your shoulders straight up toward your ears.', 'Hold for a second at the top.', 'Lower slowly.'],
    tips: ['Straight up and down — no rolling.', 'A pause at the top makes lighter weight work harder.'],
    mistakes: ['Rolling your shoulders in circles.', 'Bending your elbows.', 'Bouncing the weight with your legs.'],
  },
  'Dumbbell Shrug': {
    setup: ['Stand with a dumbbell in each hand at your sides, palms facing in.', 'Arms straight, chest up.', 'Feet hip-width apart.'],
    steps: ['Lift your shoulders straight up toward your ears.', 'Pause at the top.', 'Lower under control.'],
    tips: ['Dumbbells let your arms hang naturally at your sides.', 'Keep your neck relaxed.'],
    mistakes: ['Rolling the shoulders.', 'Hunching forward.', 'Using a weight you can barely move.'],
  },
  'Wrist Curl': {
    setup: ['Sit on a bench and rest your forearms on your thighs or the bench.', 'Hands hang off the edge, palms up, holding light dumbbells.', 'Let your wrists bend back.'],
    steps: ['Curl your wrists up as far as they go.', 'Squeeze your forearms.', 'Lower slowly into the stretch.'],
    tips: ['Turn palms down for reverse wrist curls (the top of the forearm).', 'Light weight, high reps (15–20) work well.'],
    mistakes: ['Lifting the forearms off the support.', 'Too heavy.', 'Jerking the weight.'],
  },
  "Farmer's Carry": {
    setup: ['Pick up a heavy dumbbell or kettlebell in each hand, like a deadlift.', 'Stand tall, shoulders back and down.', 'Arms straight at your sides.'],
    steps: ['Walk forward with short, steady steps.', 'Keep your body upright and your core braced.', 'Walk for the target time, then set the weights down safely.'],
    tips: ['Log the time you walked in seconds.', 'Try one weight at a time (suitcase carry) to work your core more.'],
    mistakes: ['Shrugging your shoulders.', 'Leaning to one side.', 'Dropping the weights instead of setting them down.'],
  },
  'Inverted Row': {
    setup: ['Set a bar in a rack (or Smith machine) around waist height.', 'Lie under it and grab it overhand, slightly wider than shoulders.', 'Body straight from head to heels, heels on the floor.'],
    steps: ['Pull your chest up to the bar.', 'Squeeze your shoulder blades together.', 'Lower until your arms are straight.'],
    tips: ['Raise the bar or bend your knees to make it easier.', 'A great stepping stone toward pull-ups.'],
    mistakes: ['Hips sagging.', 'Craning the neck up to the bar.', 'Partial reps.'],
  },
  'Negative Pull-Up': {
    setup: ['Stand on a box or bench under a pull-up bar.', 'Grip the bar overhand.', 'Jump or step up so your chin is over the bar.'],
    steps: ['Hold the top position for a moment.', 'Lower yourself as slowly as you can — aim for 3–5 seconds.', 'Step back up to the top and repeat.'],
    tips: ['The best way to build up to your first pull-up.', 'Add a second each week to the lowering.'],
    mistakes: ['Dropping quickly.', 'Not reaching a full hang at the bottom.', 'Doing too many reps and losing control.'],
  },
  'Dead Hang': {
    setup: ['Grip a pull-up bar overhand, about shoulder width.', 'Wrap your thumbs around the bar.', 'Step or lift your feet so you hang freely.'],
    steps: ['Hang with straight arms and relax your shoulders.', 'Keep your core lightly braced so you do not swing.', 'Hold for the target time, then step down — do not drop.'],
    tips: ['Builds grip strength and stretches the shoulders and back.', 'Start with 10–20 seconds and build up.'],
    mistakes: ['Swinging.', 'Dropping down onto locked knees.', 'Holding your breath.'],
  },
};
