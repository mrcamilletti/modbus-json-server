ModBus RTU wrapper for JSON over TCP
====================================

Read structures
---------------

Using addr and quantity:

```
consulta = {
    id: <unit_id> | [<unit_ids>],
    read: 'coil' | 'discrete' | 'input' | 'holding'
    addr: <start_address>
    quantity: <quantity>
}
```

Using from and to:

```
consulta = {
    id: <unit_id> | [<unit_ids>],
    read: 'coil' | 'discrete' | 'input' | 'holding'
    from: <from_address>
    to: <to_address>
}
```

Write structure
---------------

```
consulta = {
    id: <unit_id> | [<unit_ids>],
    write: 'coil' | 'holding'
    value: <value> | [<values>]
    addr: <start_address>
}
```


```
Response structure
---------------
consulta = {
    id: <unit_id>,
    ... 
    result: {
        data: [<array_data>],
        buffer: <buffered_data>
    }
}
```
