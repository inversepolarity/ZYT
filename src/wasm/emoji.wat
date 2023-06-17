(module
;; actions
  (import "env" "restore" (func $restore (result i32)))


;; ref creators
  (import "env" "createRef" (func $createRef (result i32)))
  (import "env" "createMapRef" (func $createMapRef (result i32)))
  (import "env" "createNodeRef" (func $createNodeRef (result i32)))

;;   utils
  (import "env" "length" (func $length (result i32)))
  (import "env" "logInt" (func $logInt (result i32)))
  (import "env" "logRef" (func $logRef (result i32)))
  (import "env" "free" (func $free (result i32)))
    
  ;; from: https://github.com/WebAssembly/interface-types/issues/18#issuecomment-430605795

  ;; exports
  (func (export "put_back")
  	(local $hashmap i32)
	(local $node i32)

	(local.set $hashmap (call $createMapRef))
	(local.set $node (call $createNodeRef))

	(call $restore (local.get $hashmap (local.get $node)))

	(call $logInt (call $length (local.get $hashmap)))
    (call $logRef (local.get $node))
    (call $free (local.get $node))
	)
  )